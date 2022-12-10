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
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import { EditIcon, LockIcon, UnlockIcon, ViewIcon } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import madrisaService from '../../../services/MadrisaService';
import { getDateTime } from 'src/utils/dateTime';

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
        element.code.toLowerCase().indexOf(queryL) !== -1 ||
        element.cid?.toLowerCase().indexOf(queryL) !== -1 ||
        element.cname?.toLowerCase().indexOf(queryL) !== -1 ||
        element.address?.toLowerCase().indexOf(queryL) !== -1
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
    { id: 'id', label: 'id', align: 'left' },
    { id: 'createdAt', label: 'Date', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

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
    navigate(`/admin/madaris/${ID}`);
  };

  const handleEdit = (ID) => {
    navigate(`/admin/madaris/${ID}/edit`);
  };

  const handleLock = (ID) => {
    madrisaService
      .lock(ID)
      .then(getData)
      .catch(() => console.error('Error on handling lock'));
  };

  const handleUnlock = (ID) => {
    madrisaService
      .unlock(ID)
      .then(getData)
      .catch(() => console.error('Error on handling unlock'));
  };

  /*
    Table View More Variables
  */
  const MORE_MENU_LOCKED = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Unlock', icon: UnlockIcon, event: handleUnlock, id: 0 }
  ];

  const MORE_MENU_UNLOCKED = [
    { text: 'View', icon: ViewIcon, event: handleView, id: 0 },
    { text: 'Lock', icon: LockIcon, event: handleLock, id: 0 },
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 }
  ];

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

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
                    const { id, createdAt, status } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        component={Link}
                        to={`/admin/madaris/${id}`}
                        key={name}
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
                          {/* <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              /> */}
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{getDateTime(createdAt)}</TableCell>
                        <TableCell align="left">{status}</TableCell>

                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu ID={[id]} Options={MORE_MENU_LOCKED} />
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
