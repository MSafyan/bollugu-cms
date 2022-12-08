/*
  Imports
*/
import {
  Avatar,
  Card,
  Stack,
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
import { Link, useNavigate, useParams } from 'react-router-dom';

import Label from 'src/components/misc/Label';
import Dialog from 'src/components/misc/alerts/Dialog';
import { EditIcon, UnpaidIcon, ViewIcon } from 'src/config/icons';
import { DefaultAvatar, defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import classService from 'src/services/ClassService';
import notificationService from 'src/services/NotificationService';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
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
        element.username.toLowerCase().indexOf(queryL) !== -1 ||
        element.name.toLowerCase().indexOf(queryL) !== -1 ||
        String(element.obtained).toLowerCase().indexOf(queryL) !== -1 ||
        String(element.total).toLowerCase().indexOf(queryL) !== -1 ||
        String(element.attendancePercentage).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ classData, getData, blocked: mBlocked }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const {
    id: classID,
    blocked: ended,
    students: data,
    attendancePercentage: attendaceLimit
  } = classData;
  const TableHeader = [
    { id: 'username', label: 'Roll Number', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'total', label: 'Total Marks', align: 'center' },
    { id: 'obtained', label: 'Obtained Marks', align: 'center' },
    { id: 'attendancePercentage', label: 'Attendance', align: 'center' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const [showDelete, setShowDelete] = useState(-1);

  const navigate = useNavigate();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  const mID = useParams().mID;

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
      const newSelecteds = data.map((n) => n.id);
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
    navigate(`/coordinator/students/${ID}`);
  };

  const handleEdit = (student) => {
    navigate(
      `/coordinator/madaris/${mID}/students/${student.section.batch.id}/${student.section.id}/${student.username}/edit`
    );
  };

  const handleRemove = (ID) => {
    setShowDelete(ID);
  };

  const handleClose = () => {
    setShowDelete(-1);
  };

  const handleRemoveFinal = () => {
    classService
      .updateStudents(
        classID,
        data.filter((s) => s.id !== showDelete)
      )
      .then(() => {
        const s = data.find((sf) => sf.id == showDelete);
        if (s) {
          notificationService.addStudent(
            s,
            `You have been removed`,
            ` from class ${classData.course.name} by ${classData.teacher.name}.`,
            ``
          );
          notificationService.addTeacher(
            classData.teacher.id,
            `${s.name} (${s.username})`,
            `has been removed from class ${classData.name} .`,
            `/teacher/${classData.name}/students`
          );
        }

        getData();
      })
      .catch((_error) => {
        //TODO: Error deleting student
      })
      .finally(() => setShowDelete(-1));
  };

  const MORE_MENU_REMOVE = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 1 },
    { text: 'Remove', icon: UnpaidIcon, event: handleRemove, id: 2 }
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
                    const {
                      id,
                      username,
                      name,
                      blocked,
                      total,
                      obtained,
                      attendancePercentage,
                      image
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    const Image = image ? image : DefaultAvatar;

                    return (
                      <TableRow
                        hover
                        component={Link}
                        to={`/coordinator/students/${username}`}
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        style={{
                          backgroundColor: blocked
                            ? palette.background.locked
                            : palette.background.hover,
                          textDecoration: 'none'
                        }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={Image} />
                            <Typography variant="subtitle2" noWrap>
                              {username}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="center">{total || 1}</TableCell>
                        <TableCell align="center">{obtained}</TableCell>
                        <TableCell align="center">
                          <Label
                            style={{
                              textAlign: 'center',
                              width: 'inherit',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                            variant="ghost"
                            color={attendancePercentage < attendaceLimit ? 'error' : 'success'}
                          >
                            {attendancePercentage}%
                          </Label>
                        </TableCell>
                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu
                            ID={[username, row, id]}
                            Options={ended || mBlocked ? MORE_MENU : MORE_MENU_REMOVE}
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
        buttonText2={'Remove'}
        openDialog={showDelete != -1}
        handleButton={handleClose}
        handleButton2={handleRemoveFinal}
      >
        Are you sure you want to remove?
      </Dialog>
    </>
  );
};
