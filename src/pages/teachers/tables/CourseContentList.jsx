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
import { useNavigate } from 'react-router-dom';

import Dialog from 'src/components/misc/alerts/Dialog';
import { DownloadIcon, EditIcon, TrashIcon, ViewIcon2 } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getDateTime } from 'src/utils/dateTime';
import { getComparator, stabilize } from 'src/utils/table';
import coursecontentService from 'src/services/CourseContentService';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';

/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator, query) {
  let toSort = array;
  if (query) {
    toSort = filter(
      array,
      (element) =>
        element.topic.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        element.type.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        getDateTime(element.createdAt).toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
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
    { id: 'createdAt', label: 'Date Added', align: 'left' },
    { id: 'type', label: 'Content Type', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[1].id);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleView = (ID) => {
    const target = data.find((d) => d.id == ID);
    window.open(target.url, '_blank');
  };

  const handleDownload = (ID) => {
    const target = data.find((d) => d.id == ID);
    coursecontentService.download(target.file.url, target.file.name);
  };

  /*
    Table View More Variables
  */

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
    coursecontentService
      .remove(showDelete)
      .then(reload)
      .catch((_error) => {
        //TODO: error handling here
      })
      .finally(() => setShowDelete(-1));
  };

  /*
    Table View More Variables
  */

  const MORE_MENU = [{ text: 'View', icon: ViewIcon2, event: handleView, id: 0 }];

  const MORE_MENU_FILE = [{ text: 'Download', icon: DownloadIcon, event: handleDownload, id: 0 }];

  if (!past) {
    MORE_MENU.push({ text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 });
    MORE_MENU.push({ text: 'Delete', icon: TrashIcon, event: handleDelete, id: 0 });
    MORE_MENU_FILE.push({ text: 'Edit', icon: EditIcon, event: handleEdit, id: 0 });
    MORE_MENU_FILE.push({ text: 'Delete', icon: TrashIcon, event: handleDelete, id: 0 });
  }

  /*
    Use Effect Hooks.
  */

  /*
    Main Design.
  */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Teacher's Content
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
                    const { id, createdAt, topic, type } = row;
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
                            {topic}
                          </Typography>
                        </TableCell>
                        <TableCell align="left"> {getDateTime(createdAt)}</TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu
                            ID={[id]}
                            Options={type == 'File' ? MORE_MENU_FILE : MORE_MENU}
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
