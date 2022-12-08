/*
  Imports
*/
import {
  Button,
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
import { useParams } from 'react-router-dom';

import Label from 'src/components/misc/Label';
import { DownloadIcon } from 'src/config/icons';
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
        element.username.toLowerCase().indexOf(queryL) !== -1 ||
        element.name.toLowerCase().indexOf(queryL) !== -1 ||
        getDateTime(element.submittedDate).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ students_data: data, file, submissions }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'username', label: 'Roll No', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'submittedDate', label: 'Date Submitted', align: 'left' },
    { id: 'submittedAss_', label: 'Status', align: 'center' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const [downloadingAll, setDownloadingAll] = useState(false);
  const aID = useParams().aID;

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

  const handleDownload = (ID) => {
    const target = data.find((d) => d.id == ID);
    assignmentService.download(target.submittedAss.file.url, target.submittedAss.file.name);
  };

  const downloadFile = () => {
    assignmentService.download(file.url, file.name);
  };

  const downloadAll = () => {
    if (downloadingAll) return;
    setDownloadingAll(true);
    assignmentService
      .downloadAllFiles(aID)
      .then((data_) => {
        window.location = data_.url;
      })
      .catch(() => {
        console.error('Erorr downloading all');
      })
      .finally(() => {
        setDownloadingAll(false);
      });
  };
  /*
    Table View More Variables
  */

  const MORE_MENU = [{ text: 'Download', icon: DownloadIcon, event: handleDownload, id: 0 }];

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
      <Stack direction="row" mb={5} spacing={2} alignItems="center" justifyContent="flex-end">
        {file && (
          <Button variant="contained" onClick={downloadFile}>
            Download File
          </Button>
        )}
        {submissions > 0 && (
          <Button variant="contained" onClick={downloadAll} disabled={downloadingAll}>
            Download All
          </Button>
        )}
      </Stack>

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
                    const { id, username, name, submittedAss, submittedDate } = row;
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
                            {username}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">
                          {submittedDate ? getDateTime(submittedDate) : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Label variant="ghost" color={(submittedAss && 'success') || 'error'}>
                            {submittedAss ? 'Submitted' : 'Not Submitted'}
                          </Label>
                        </TableCell>
                        {submittedAss && (
                          <TableCell align="right">
                            <UserMoreMenu ID={[id]} Options={MORE_MENU} />
                          </TableCell>
                        )}
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
