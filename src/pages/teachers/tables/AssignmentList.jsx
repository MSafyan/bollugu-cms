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
import { Link, useNavigate } from 'react-router-dom';

import Label from 'src/components/misc/Label';
import Dialog from 'src/components/misc/alerts/Dialog';
import { EditIcon, TrashIcon, ViewIcon } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getDateTime } from 'src/utils/dateTime';
import { getComparator, stabilize } from 'src/utils/table';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import assignmentService from '../../../services/AssignmentService';
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
        element.description.toLowerCase().indexOf(queryL) !== -1 ||
        getDateTime(element.start).toLowerCase().indexOf(queryL) !== -1 ||
        getDateTime(element.end).toLowerCase().indexOf(queryL) !== -1 ||
        String(element.marks).toLowerCase().indexOf(queryL) !== -1 ||
        String(element.submissions).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ assignment_data: data, reload, past }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'topic', label: 'Topic', align: 'left' },
    { id: 'start', label: 'Start Date', align: 'left' },
    { id: 'end', label: 'End Date', align: 'left' },
    { id: 'description', label: 'Description', align: 'left' },
    { id: 'submissions', label: 'Submitted', align: 'left' },
    { id: 'marks', label: 'Total Marks', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const [showDelete, setShowDelete] = useState(-1);

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

  const handleMoreMenuCell = (event) => {
    event.preventDefault();
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
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

  const handleView = (ID) => {
    navigate(`./${ID}`);
  };

  const handleDeleteFinal = () => {
    assignmentService
      .remove(showDelete)
      .then(reload)
      .catch((_error) => {
        //TODO: Better error handling
      })
      .finally(() => setShowDelete(-1));
  };

  /*
    Table View More Variables
  */

  const MORE_MENU_PENDING = [{ text: 'View', icon: ViewIcon, event: handleView, id: 0 }];

  const MORE_MENU = [{ text: 'View', icon: ViewIcon, event: handleView, id: 0 }];

  if (!past) {
    MORE_MENU.push({ text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 });
    MORE_MENU_PENDING.push({ text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 });
    MORE_MENU_PENDING.push({ text: 'Delete', icon: TrashIcon, event: handleDelete, id: 0 });
  }

  /*
    Main Design.
  */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Assignments
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
                    const { id, topic, start, end, description, submissions, marks } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    const currentDate = new Date().getTime();
                    const startDate = new Date(start).getTime();
                    const endDate = new Date(end).getTime();
                    return (
                      <TableRow
                        hover
                        component={Link}
                        to={`./${id}`}
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        style={{
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
                            {topic}
                          </Typography>
                        </TableCell>
                        <TableCell align="left"> {getDateTime(start)}</TableCell>
                        <TableCell align="left"> {getDateTime(end)}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{submissions.length}</TableCell>
                        <TableCell align="left">{marks}</TableCell>
                        <TableCell align="center">
                          {startDate > currentDate ? (
                            <Label variant="ghost" color="secondary">
                              Pending
                            </Label>
                          ) : endDate > currentDate ? (
                            <Label variant="ghost" color="success">
                              Active
                            </Label>
                          ) : (
                            <Label variant="ghost" color="error">
                              Expired
                            </Label>
                          )}
                        </TableCell>
                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu
                            ID={[id]}
                            Options={startDate > currentDate ? MORE_MENU_PENDING : MORE_MENU}
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
    </>
  );
};
