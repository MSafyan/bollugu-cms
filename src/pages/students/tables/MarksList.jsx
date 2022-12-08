/*
  Imports
*/
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import { useState } from 'react';

import { getDateTime } from 'src/utils/dateTime';
import { getComparator, stabilize } from 'src/utils/table';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead } from '../../../components/misc/table';
/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator) {
  let toSort = array;
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
    { id: 'time', label: 'Date', align: 'left' },
    { id: 'total', label: 'Total Marks', align: 'center' },
    { id: 'obtained', label: 'Obtained Marks', align: 'center' }
  ];

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(TableHeader[1].id);

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy));
  const isUserNotFound = filteredUsers.length === 0;

  /*
    Handlers, Functions
  */
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /*
    Main Design.
  */
  return (
    <>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TableHeader}
                rowCount={data.length}
                onRequestSort={handleRequestSort}
                hideCheckBoxes={true}
              />
              <TableBody>
                {filteredUsers.map((row) => {
                  const { id, total, time, obtained } = row;

                  return (
                    <TableRow key={id} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox">
                        {/* <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              /> */}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {getDateTime(time)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{total}</TableCell>
                      <TableCell align="center">{obtained}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound data searchQuery={''} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </>
  );
};
