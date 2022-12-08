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
import { useNavigate } from 'react-router-dom';

import Dialog from 'src/components/misc/alerts/Dialog';
import { EditIcon, TrashIcon } from 'src/config/icons';
import { getDateTime } from 'src/utils/dateTime';
import { getComparator, stabilize } from 'src/utils/table';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserMoreMenu } from '../../../components/misc/table';
import marksService from '../../../services/MarksService';
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
export default ({ data, reload, past }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'topic', label: 'Topic', align: 'left' },
    { id: 'time', label: 'Date', align: 'left' },
    { id: 'total', label: 'Total Marks', align: 'center' }
  ];

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(TableHeader[1].id);
  const [showDelete, setShowDelete] = useState(-1);

  const navigate = useNavigate();

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

  const handleEdit = (ID) => {
    navigate(`./${ID}/edit`);
  };

  const handleDelete = (ID) => {
    setShowDelete(ID);
  };

  const handleClose = () => {
    setShowDelete(-1);
  };

  const handleDeleteFinal = () => {
    marksService
      .remove(showDelete)
      .then(reload)
      .catch((_error) => {
        //TODO: Error handling here
      })
      .finally(() => setShowDelete(-1));
  };

  /*
    Table View More Variables
  */

  const MORE_MENU = [
    { text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 },
    { text: 'Delete', icon: TrashIcon, event: handleDelete, id: 0 }
  ];

  /*
    Table View More Variables
  */

  /*
    Use Effect Hooks.
  */

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
                  const { id, total, time, topic } = row;

                  return (
                    <TableRow key={id} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {topic}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{getDateTime(time)}</TableCell>
                      <TableCell align="center">{total}</TableCell>
                      {!past && (
                        <TableCell align="right">
                          <UserMoreMenu ID={[id]} Options={MORE_MENU} />
                        </TableCell>
                      )}
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
    </>
  );
};
