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

import AreaCharts from 'src/components/charts/AreaCharts';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
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
        element.topic.toLowerCase().indexOf(queryL) !== -1 ||
        element.type.toLowerCase().indexOf(queryL) !== -1
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
    { id: 'type', label: 'Category', align: 'left' },
    { id: 'topic', label: 'Topic', align: 'left' },
    { id: 'attempted', label: 'Attempted', align: 'center' },
    { id: 'total', label: 'Total Marks', align: 'center' },
    { id: 'average', label: 'Obtained (Avg)', align: 'center' },
    { id: 'passing', label: 'Pass', align: 'center' },
    { id: 'failing', label: 'Fail', align: 'center' },
    { id: 'maximum', label: 'Maximum Marks', align: 'center' },
    { id: 'minimum', label: 'Minimum Marks', align: 'center' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  const labels = [];
  const passing_c = [];
  const failing_c = [];
  filteredUsers.forEach((c) => {
    labels.push(c.topic);
    passing_c.push(c.passing);
    failing_c.push(c.failing);
  });

  const chartData = [
    {
      name: 'Passing',
      type: 'area',
      data: passing_c,
      color: palette.success.main
    },
    {
      name: 'Failing',
      type: 'area',
      data: failing_c,
      color: palette.error.main
    }
  ];
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
        Marks Summary
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
                      total,
                      type,
                      topic,
                      attempted,
                      passing,
                      failing,
                      average,
                      maximum,
                      minimum
                    } = row;
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
                        <TableCell>
                          <Typography variant="subtitle2" noWrap>
                            {type}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{topic}</TableCell>
                        <TableCell align="center">{attempted}</TableCell>
                        <TableCell align="center">{total}</TableCell>
                        <TableCell align="center">{average}</TableCell>
                        <TableCell align="center">{passing}</TableCell>
                        <TableCell align="center">{failing}</TableCell>
                        <TableCell align="center">{maximum}</TableCell>
                        <TableCell align="center">{minimum}</TableCell>
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
                      <SearchNotFound data searchQuery={filterName} />
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
      <br />
      <br />
      <AreaCharts title={'Pass/Fail Details'} labels={labels} data={chartData} />
    </>
  );
};
