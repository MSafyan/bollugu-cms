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
  TableRow
} from '@material-ui/core';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import { PaidIcon, UnpaidIcon } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import Label from '../../../components/misc/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import feeService from '../../../services/FeeService';

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
        element.madrisa.code.toLowerCase().indexOf(queryL) !== -1 ||
        element.madrisa.name.toLowerCase().indexOf(queryL) !== -1 ||
        String(element.amount).toLowerCase().indexOf(queryL) !== -1 ||
        String(element.batch.year).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'madrisa.code', label: 'Madrisa ID', align: 'left' },
    { id: 'madrisa.name', label: 'Madrisa', align: 'left' },
    { id: 'batch.year', label: 'Year', align: 'left' },
    { id: 'batch.sections', label: 'Students', align: 'left' },
    { id: 'amount', label: 'Fee', align: 'left' },
    { id: 'paid', label: 'Status', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[2].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  /*
    Handlers, Functions
  */
  const getData = () => {
    setLoading(true);
    feeService
      .getAll(0, 400)
      .then((fee) => {
        setData(fee);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const handlePaid = (ID) => {
    feeService
      .pay(ID)
      .then(getData)
      .catch(() => console.error('Error on handling fee pay'));
  };

  const handleUnpaid = (ID) => {
    feeService
      .unpay(ID)
      .then(getData)
      .catch(() => console.error('Error on handling fee unpay'));
  };

  /*
    Table View More Variables
  */
  const MORE_MENU_PAID = [{ text: 'Unpaid', icon: UnpaidIcon, event: handleUnpaid, id: 0 }];

  const MORE_MENU_UNPAID = [{ text: 'Paid', icon: PaidIcon, event: handlePaid, id: 0 }];

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design.
  */
  return (
    <>
      {loading ? (
        <CenterLoading />
      ) : (
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
                        const { id, madrisa, amount, paid, students, batch } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;

                        return (
                          <TableRow
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell align="left">{madrisa.code}</TableCell>
                            <TableCell align="left">{madrisa.name}</TableCell>
                            <TableCell align="left">{batch.year}</TableCell>
                            <TableCell align="left">{students}</TableCell>
                            <TableCell align="left">{amount}</TableCell>
                            <TableCell align="left">
                              <Label variant="ghost" color={(!paid && 'error') || 'success'}>
                                {paid ? 'Paid' : 'Unpaid'}
                              </Label>
                            </TableCell>
                            <TableCell align="right">
                              <UserMoreMenu
                                ID={[id]}
                                Options={paid ? MORE_MENU_PAID : MORE_MENU_UNPAID}
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
        </>
      )}
    </>
  );
};
