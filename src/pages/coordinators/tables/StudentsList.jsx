/*
  Imports
*/
import {
  Avatar,
  Card,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
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
import Dialog from 'src/components/misc/alerts/Dialog';
import { EditIcon, LockIcon, MoveIcon, TrashIcon, UnlockIcon, ViewIcon } from 'src/config/icons';
import { DefaultAvatar, defaultPerPage, rowsPerPageList } from 'src/config/settings';
import notificationService from 'src/services/NotificationService';
import sectionService from 'src/services/SectionService';
import palette from 'src/theme/palette';
import { getComparator, stabilize } from 'src/utils/table';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import Scrollbar from '../../../components/Scrollbar';
import studentService from '../../../services/StudentService';

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
        element.name.toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ ended, students, sections, reload }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const sID = useParams().sID;

  const TableHeader = [
    { id: 'username', label: 'Roll Number', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' }
  ];

  const [data, setData] = useState(students);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [openMove, setOpenMove] = useState(false);
  const [moved, setMoved] = useState(false);
  const currentSection = sections.find((value) => value.id == sID);
  const [moveToSection, setMoveToSection] = useState(
    sections.find((row) => row.id !== currentSection?.id)
  );
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const [showDelete, setShowDelete] = useState(-1);

  const navigate = useNavigate();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  /*
    Handlers, Functions
  */

  const dataUpdated = () => {
    reload();
  };

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

  const handleClick = (event, name) => {
    event.preventDefault();
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleMoreMenuCell = (event) => {
    event.preventDefault();
  };

  const handleView = (ID) => {
    navigate(`/coordinator/students/${ID}`);
  };

  const handleEdit = (ID) => {
    navigate(`./${ID}/edit`);
  };

  function handleMove(e) {
    setMoveToSection(e.target.value);
  }

  function handleMoveConfirm() {
    const StudentsList = [...moveToSection.students, ...selected];
    selected.forEach((s) => {
      notificationService.addStudent(
        s,
        `Section change.`,
        `You have been moveed to section ${moveToSection.name}`,
        ''
      );
    });
    sectionService.moveStudents(moveToSection.id, StudentsList).then(() => {
      setOpenMove(false);
      setMoved(true);
    });
  }

  const handleCloseSuccess = () => {
    setMoved(false);
    dataUpdated();
  };

  const handleCloseMove = () => {
    setOpenMove(false);
  };

  const handleOpenMove = () => {
    setOpenMove(true);
  };

  const handleLock = (ID) => {
    studentService
      .lock(ID)
      .then(() => {
        const student = students.find((s) => ID == s.u_id);
        student.blocked = true;
        setData([...students]);
      })
      .catch((_err) => {
        //Error locking student;
      });
  };

  const handleUnlock = (ID) => {
    studentService
      .unlock(ID)
      .then(() => {
        const student = students.find((s) => ID == s.u_id);
        student.blocked = false;
        setData([...students]);
      })
      .catch((_err) => {
        //Something went wrong
      });
  };

  const handleDelete = (ID) => {
    setShowDelete(ID);
  };

  const handleClose = () => {
    setShowDelete(-1);
  };

  const handleDeleteFinal = () => {
    studentService
      .remove(showDelete)
      .then(dataUpdated)
      .catch((_error) => {
        //Error deleting student
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
    { text: 'Delete', icon: TrashIcon, event: handleDelete, id: 2 }
  ];

  const MORE_MENU_UNLOCKED = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Unlock', icon: UnlockIcon, event: handleUnlock, id: 1 },
    { text: 'Delete', icon: TrashIcon, event: handleDelete, id: 2 }
  ];

  const MORE_MENU_LOCKED_ND = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Lock', icon: LockIcon, event: handleLock, id: 1 }
  ];

  const MORE_MENU_UNLOCKED_ND = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Unlock', icon: UnlockIcon, event: handleUnlock, id: 1 }
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
          handleEvent={handleOpenMove}
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
                hideCheckBoxes={ended}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, username, name, blocked, u_id, classes, image } = row;
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
                        <TableCell padding="checkbox">
                          {!ended && (
                            <Checkbox
                              checked={isItemSelected}
                              onClick={(event) => handleClick(event, id)}
                            />
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={Image} />
                            <Typography variant="subtitle2" noWrap>
                              {username}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu
                            ID={[username, u_id, id]}
                            Options={
                              ended
                                ? MORE_MENU
                                : classes.length > 0
                                ? blocked
                                  ? MORE_MENU_UNLOCKED_ND
                                  : MORE_MENU_LOCKED_ND
                                : blocked
                                ? MORE_MENU_UNLOCKED
                                : MORE_MENU_LOCKED
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
        warning
        buttonText={'Close'}
        buttonText2={'Delete'}
        openDialog={showDelete != -1}
        handleButton={handleClose}
        handleButton2={handleDeleteFinal}
      >
        Are you sure you want to delete?
      </Dialog>

      <Dialog
        error
        buttonText={'Close'}
        buttonText2={'Move'}
        openDialog={openMove}
        children={
          sections && (
            <>
              <InputLabel label="Sections">Move Selected Students to:</InputLabel>
              <Select
                onChange={(e) => handleMove(e)}
                fullWidth
                defaultValue={sections.filter((row) => row.id !== currentSection?.id)[0]?.id}
              >
                {sections
                  .filter((row) => row.id !== currentSection?.id)
                  .map((row) => (
                    <MenuItem key={row.id} value={row}>{`${row.name}`}</MenuItem>
                  ))}
              </Select>
            </>
          )
        }
        handleButton={handleCloseMove}
        handleButton2={handleMoveConfirm}
        icon={MoveIcon}
      ></Dialog>

      <Dialog
        // success
        buttonText={'Close'}
        openDialog={moved}
        handleButton={handleCloseSuccess}
      >
        Moved Successfuly
      </Dialog>
    </>
  );
};
