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

import Label from 'src/components/misc/Label';
import { DefaultAvatar, defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../../components/misc/table';
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
export default ({ classData: data, attendanceLimit }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
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

  /*
    Main Design.
  */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Students
      </Typography>

      <br />
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
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        style={{
                          backgroundColor: blocked
                            ? palette.background.locked
                            : palette.background.default
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
                            color={attendancePercentage >= attendanceLimit ? 'success' : 'error'}
                          >
                            {attendancePercentage}%
                          </Label>
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
    </>
  );
};
