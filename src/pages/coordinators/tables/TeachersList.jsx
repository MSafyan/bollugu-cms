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
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Dialog from 'src/components/misc/alerts/Dialog';
import { EditIcon, UnpaidIcon, ViewIcon } from 'src/config/icons';
import { DefaultAvatar, defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import teacherService from 'src/services/TeacherService';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import { MadrisaContext } from '../context/MadrisaContext';

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
export default ({ teachers: data, getData, blocked: mBlocked }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'username', label: 'CNIC', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'courses', label: 'Courses', align: 'left' },
    { id: 'classes.length', label: 'Classes', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);
  const [showDelete, setShowDelete] = useState(-1);

  const madrisa = useContext(MadrisaContext);
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
    navigate(`/coordinator/teachers/${ID}`);
  };

  const handleEdit = (ID) => {
    navigate(`./edit/${ID}`);
  };

  const handleDelete = (ID) => {
    setShowDelete(ID);
  };

  const handleClose = () => {
    setShowDelete(-1);
  };

  const handleDeleteFinal = () => {
    const teacher = data.find((t) => t.id == showDelete);
    teacherService
      .updateMadrisa(
        teacher.id,
        teacher.madrisa_ids.filter((i) => i != madrisa.id)
      )
      .then(getData)
      .catch((_error) => {
        //Error deleting teacher
      })
      .finally(() => setShowDelete(-1));
  };

  /*
    Table View More Variables
  */
  const MORE_MENU_BLOCKED = [{ text: 'View', icon: ViewIcon, event: handleView, id: 0 }];

  const MORE_MENU = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 }
  ];

  const MORE_MENU_DELETE = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Remove', icon: UnpaidIcon, event: handleDelete, id: 1 }
  ];

  /*
    Use Effect Hooks.
  */

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
                    const { username, id, name, classes, courses, blocked, totalClasses, image } =
                      row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    const Image = image ? image : DefaultAvatar;

                    return (
                      <TableRow
                        hover
                        component={Link}
                        to={`/coordinator/teachers/${username}`}
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
                        <TableCell align="left">{courses}</TableCell>
                        <TableCell align="left">{classes.length}</TableCell>
                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu
                            ID={[username, id]}
                            Options={
                              mBlocked
                                ? MORE_MENU_BLOCKED
                                : totalClasses
                                ? MORE_MENU
                                : MORE_MENU_DELETE
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
        buttonText2={'Remove'}
        openDialog={showDelete != -1}
        handleButton={handleClose}
        handleButton2={handleDeleteFinal}
      >
        Are you sure you want to remove?
      </Dialog>
    </>
  );
};
