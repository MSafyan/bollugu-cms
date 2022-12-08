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

import Label from 'src/components/misc/Label';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getDateTime } from 'src/utils/dateTime';
import { getComparator, stabilize } from 'src/utils/table';
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
        element.topic.toLowerCase().indexOf(queryL) !== -1 ||
        getDateTime(element.start).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ data }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'start', label: 'Date', align: 'left' },
    { id: 'topic', label: 'Topic', align: 'left' },
    { id: 'present', label: 'Status', align: 'center' }
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

  /*
    Main Design.
  */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        History
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
                    const { id, start, topic, present } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              /> */}
                        </TableCell>
                        <TableCell align="left">{getDateTime(start)}</TableCell>
                        <TableCell align="left">{topic}</TableCell>
                        <TableCell align="center">
                          <Label variant="ghost" color={present ? 'success' : 'error'}>
                            {present ? 'Present' : 'Absent'}
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
