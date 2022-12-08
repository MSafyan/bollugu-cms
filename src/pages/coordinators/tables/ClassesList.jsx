/*
  Imports
*/
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import { filter } from 'lodash';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Label from 'src/components/misc/Label';
import Dialog from 'src/components/misc/alerts/Dialog';
import { EditIcon, LockIcon, TrashIcon, UnlockIcon, ViewIcon } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import notificationService from 'src/services/NotificationService';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import classService from '../../../services/ClassService';

/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator, query) {
  let toSort = array;
  if (query) {
    const queryL = query.toLowerCase();
    toSort = filter(
      array,
      (element) =>
        element.name.toLowerCase().indexOf(queryL) !== -1 ||
        element.teacher.name.toLowerCase().indexOf(queryL) !== -1 ||
        element.teacher.username.toLowerCase().indexOf(queryL) !== -1 ||
        element.course.name.toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ classes, ended, getData }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'name', label: 'Class', align: 'left' },
    { id: 'teacher.username', label: 'CNIC', align: 'left' },
    { id: 'teacher.name', label: 'Teacher', align: 'left' },
    { id: 'course.name', label: 'Course', align: 'left' },
    { id: 'students.length', label: 'Students', align: 'left' },
    { id: 'attendance.length', label: 'Classes', align: 'left' },
    { id: 'pass', label: ended ? 'Passed' : 'Passing', align: 'left' },
    { id: 'fail', label: ended ? 'Failed' : 'Failing', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const [data, setData] = useState(classes);
  const [showDelete, setShowDelete] = useState(-1);

  const navigate = useNavigate();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  /*
    Handlers, Functions
  */
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleMoreMenuCell = (event) => {
    event.preventDefault();
  };

  const handleView = (ID) => {
    navigate(`./${ID}`);
  };

  const handleEdit = (ID) => {
    navigate(`./${ID}/edit`);
  };

  const handleLock = (ID) => {
    classService
      .lock(ID)
      .then(() => {
        const class_data = classes.find((class_find) => ID == class_find.id);
        class_data.blocked = true;
        setData([...classes]);
      })
      .catch((_err) => {
        //Error handling lock here
      });
  };

  const handleUnlock = (ID) => {
    classService
      .unlock(ID)
      .then(() => {
        const class_data = classes.find((class_find) => ID == class_find.id);
        class_data.blocked = false;
        setData([...classes]);
      })
      .catch((_err) => {
        //Error handling unlock here
      });
  };

  const handleDelete = (ID) => {
    setShowDelete(ID);
  };

  const handleClose = () => {
    setShowDelete(-1);
  };

  const handleDeleteFinal = () => {
    classService
      .remove(showDelete)
      .then((c) => {
        c.students.forEach((s) => {
          notificationService.addStudent(s.id, `${c.name}`, `has been removed.`, ``);
        });
        notificationService.addTeacher(c.teacher.id, `${c.name}`, `has been removed.`, ``);
        getData();
      })
      .catch((_error) => {
        //Error deleting class
      })
      .finally(() => setShowDelete(-1));
  };
  /*
    Table View More Variables
  */
  const MORE_MENU_LOCKED = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Lock', icon: LockIcon, event: handleLock, id: 1 },
    { text: 'Delete', icon: TrashIcon, event: handleDelete, id: 1 }
  ];

  const MORE_MENU_UNLOCKED = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Unlock', icon: UnlockIcon, event: handleUnlock, id: 1 },
    { text: 'Delete', icon: TrashIcon, event: handleDelete, id: 1 }
  ];

  const MORE_MENU = [{ text: 'View', icon: ViewIcon, event: handleView, id: 0 }];

  /*
    Main Design.
  */
  return (
    <>
      <Card>
        <UserListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TableHeader}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                hideCheckBoxes={true}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, teacher, course, name, blocked, students, attendance, pass, fail } =
                      row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        component={Link}
                        to={`./${name}`}
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        style={{
                          backgroundColor:
                            blocked && !ended
                              ? palette.background.locked
                              : palette.background.hover,
                          textDecoration: 'none'
                        }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{teacher?.username}</TableCell>
                        <TableCell align="left">{teacher?.name}</TableCell>
                        <TableCell align="left">{course?.name}</TableCell>
                        <TableCell align="center">{students?.length}</TableCell>
                        <TableCell align="center">{attendance?.length}</TableCell>
                        <TableCell align="center">
                          <Label variant="ghost" color="success">
                            {pass}
                          </Label>
                        </TableCell>
                        <TableCell align="center">
                          <Label variant="ghost" color="error">
                            {fail}
                          </Label>
                        </TableCell>
                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu
                            ID={[name, id]}
                            Options={
                              ended ? MORE_MENU : blocked ? MORE_MENU_UNLOCKED : MORE_MENU_LOCKED
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={rowsPerPageList}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog
        error
        buttonText={'Close'}
        buttonText2={'Delete'}
        openDialog={showDelete != -1}
        handleButton={handleClose}
        handleButton2={handleDeleteFinal}
      >
        Are you sure you want to delete the class?
      </Dialog>
    </>
  );
};
