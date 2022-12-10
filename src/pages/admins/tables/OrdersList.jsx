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
import { filter, get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import {
  EditIcon,
  LockIcon,
  OrderListIcon,
  OrdersIcon,
  UnlockIcon,
  ViewIcon
} from 'src/config/icons';
import {
  defaultPerPage,
  ORDER_STATUS,
  ORDER_STATUS_ORDER,
  rowsPerPageList
} from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import madrisaService from '../../../services/MadrisaService';
import { getDateTime } from 'src/utils/dateTime';
import Dialog from 'src/components/misc/alerts/Dialog';
import bookingService from 'src/services/BookingServiceClass';

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
        element.id.toString().toLowerCase().indexOf(queryL) !== -1 ||
        element.status.toLowerCase().indexOf(queryL) !== -1 ||
        getDateTime(element.createdAt).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ data, pagination, setPagination, setLoading, getData }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'id', label: 'Order #', align: 'left' },
    { id: 'createdAt', label: 'Date', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' }
  ];

  const [search, setSearch] = useState(pagination.search);
  const [selected, setSelected] = useState([]);
  const emptyRows = pagination.page > 0 ? data.items.length : 0;
  const isUserNotFound = data.items.length === 0;

  const [openDia, setOpenDia] = useState(false);

  /*
    Handlers, Functions
  */

  const handleRequestSort = (_event, property) => {
    const isDesc = pagination.sort_by == property && pagination.order == 'desc';
    setPagination({ ...pagination, sort_by: property, order: isDesc ? 'asc' : 'desc' });
  };

  const handleChangePage = (_event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangePerPage = (event) => {
    setPagination({ ...pagination, perPage: parseInt(event.target.value, 10), page: 0 });
  };

  const handleSearchInput = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = (event) => {
    if (event.keyCode == 13 && search != pagination.search) {
      setPagination({ ...pagination, search, page: 0 });
    }
  };
  const handleMoreMenuCell = (event) => {
    event.preventDefault();
  };

  const handleView = (ID) => {
    setOpenDia(data.items.find((item) => item.id === ID));
  };

  const handleClose = () => {
    setOpenDia(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.items.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const updateStatus = () => {
    setLoading(true);
    bookingService
      .update(openDia?.id, ORDER_STATUS_ORDER[ORDER_STATUS_ORDER.indexOf(openDia?.status) + 1])
      .then(getData)
      .catch((err) => console.log(err));
  };

  /*
    Main Design.
  */
  return (
    <>
      <Card>
        <UserListToolbar
          numSelected={selected.length}
          filterName={search}
          onFilterName={handleSearchInput}
          handleSearch={handleSearch}
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={pagination.order}
                orderBy={pagination.sort_by}
                headLabel={TableHeader}
                rowCount={data.items.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                hideCheckBoxes={true}
              />
              <TableBody>
                {data.items.map((row) => {
                  const { id, createdAt, status } = row;
                  const isItemSelected = selected.indexOf(id) !== -1;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleView(id)}
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      style={{
                        backgroundColor: palette.background.hover,
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
                      <TableCell align="left">{ORDER_STATUS[status]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={TableHeader.length + 1} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={search} />
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
          count={data.meta.pagination.total}
          rowsPerPage={pagination.perPage}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePerPage}
        />
      </Card>

      <Dialog
        buttonText={'Close'}
        openDialog={openDia}
        handleButton={handleClose}
        icon={OrderListIcon}
        color={palette.primary.main}
        marginTop={0}
        buttonText2={
          ORDER_STATUS[ORDER_STATUS_ORDER[ORDER_STATUS_ORDER.indexOf(openDia?.status) + 1]]
        }
        handleButton2={updateStatus}
        disabledButton2={ORDER_STATUS_ORDER.indexOf(openDia?.status) === 3}
      >
        {React.Children.toArray(
          openDia?.order_items?.map((item) => (
            <>
              <Typography variant="p">
                {item.quantity} x {item.name}
              </Typography>
              <br />
            </>
          ))
        )}
      </Dialog>
    </>
  );
};
