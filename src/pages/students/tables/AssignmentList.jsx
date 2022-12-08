/*
  Imports
*/
import {
  Box,
  Button,
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

import Label from 'src/components/misc/Label';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingWithLabel from 'src/components/misc/LoadingWithLabel';
import { DownloadIcon, UploadIcon, UploadIcon2 } from 'src/config/icons';
import {
  acceptFileUpload,
  defaultPerPage,
  DefaultUploadedFileImage,
  hideFileAlertIn,
  rowsPerPageList
} from 'src/config/settings';
import { getDateTime } from 'src/utils/dateTime';
import { getComparator, stabilize } from 'src/utils/table';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
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
        element.status.toLowerCase().indexOf(queryL) !== -1 ||
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
export default ({ data, reload, past, student }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'topic', label: 'Topic', align: 'left' },
    { id: 'start', label: 'Start Date', align: 'left' },
    { id: 'end', label: 'End Date', align: 'left' },
    { id: 'description', label: 'Description', align: 'left' },
    { id: 'marks', label: 'Total Marks', align: 'left' },
    { id: 'status_id', label: 'Status', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[5].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

  const [openMove, setOpenMove] = useState(false);
  const [wrongFile, setWrongFile] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [alreadySubmiited, setAlreadySubmitted] = useState();
  const [canSubmit, setCanSubmit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmitConfirm() {
    const assignment = data.find((a) => a.id === openMove);
    if (!assignment) return;
    if (submitting) return;
    setSubmitting(true);

    if (alreadySubmiited) {
      await assignmentService.deleteFile(alreadySubmiited.file.id);
    }

    const submission = { student: student.id, file: canSubmit };

    assignmentService.uploadByStudent(assignment.id, submission).then(() => {
      setOpenMove(false);
      reload();
    });
  }

  const handleCloseDialog = () => {
    if (uploadProgress > 0 && uploadProgress < 100) return;
    setWrongFile(false);
    if (canSubmit) {
      assignmentService.deleteFile(canSubmit);
      setSelectedImage(null);
      setCanSubmit(false);
    }
    setOpenMove(false);
  };

  const handleDownload = (ID) => {
    const target = data.find((d) => d.id == ID);
    if (target.file?.url) assignmentService.download(target.file.url, target.file.name);
  };

  const handleDownloadAss = (ID) => {
    const target = data.find((d) => d.id == ID);
    if (target.submitted?.file?.url)
      assignmentService.download(target.submitted.file.url, target.submitted.file.name);
  };

  const handleSubmit = (ID) => {
    const assignment = data.find((a) => a.id === ID);
    setAlreadySubmitted(assignment.submitted);
    setOpenMove(ID);
  };

  const updateProgress = (val) => {
    setUploadProgress(Math.floor((val.loaded / val.total) * 100));
  };

  const handleFileUpload = () => {
    setWrongFile(false);
    if (selectedImage) {
      assignmentService
        .upload(selectedImage, `${student.username}@${openMove}`, updateProgress)
        .then((response) => {
          setCanSubmit(response.data[0].id);
          console.log(setCanSubmit(response.data[0].id), response.data[0].id);
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setSelectedImage();
            setWrongFile(err.msg);
            setTimeout(() => setWrongFile(false), hideFileAlertIn);
          }
        });
    }
  };

  useEffect(handleFileUpload, [selectedImage]);

  /*
    Table View More Variables
  */

  const MORE_MENU_PENDING = [
    { text: 'Download', icon: DownloadIcon, event: handleDownload, id: 0 }
  ];

  const MORE_MENU_SUBMIITED = [
    { text: 'Download My', icon: UploadIcon, event: handleDownloadAss, id: 0 },
    { text: 'Download', icon: DownloadIcon, event: handleDownload, id: 0 }
  ];

  const MORE_MENU_UPLOADED = [
    { text: 'Download My', icon: UploadIcon, event: handleDownloadAss, id: 0 },
    { text: 'Download', icon: DownloadIcon, event: handleDownload, id: 0 }
  ];

  const MORE_MENU_EXPIRED = [
    { text: 'Download', icon: DownloadIcon, event: handleDownload, id: 0 }
  ];

  if (!past) {
    MORE_MENU_UPLOADED.push({ text: 'Resubmit', icon: UploadIcon, event: handleSubmit, id: 0 });
    MORE_MENU_PENDING.push({ text: 'Submit', icon: UploadIcon, event: handleSubmit, id: 0 });
  }

  const StatusColors = ['secondary', 'success', 'error', 'error'];
  const StatusMenu = [
    MORE_MENU_PENDING,
    MORE_MENU_UPLOADED,
    MORE_MENU_SUBMIITED,
    MORE_MENU_EXPIRED
  ];

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
                    const { id, topic, start, end, description, marks, status_id, status } = row;
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
                        <TableCell align="left"> {getDateTime(start)}</TableCell>
                        <TableCell align="left"> {getDateTime(end)}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{marks}</TableCell>
                        <TableCell align="center">
                          <Label variant="ghost" color={StatusColors[status_id]}>
                            {status}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <UserMoreMenu ID={[id]} Options={StatusMenu[status_id]} />
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
        buttonText2={'Submit'}
        openDialog={openMove}
        handleButton={handleCloseDialog}
        handleButton2={handleSubmitConfirm}
        icon={UploadIcon2}
        disabledButton1={uploadProgress > 0 && uploadProgress < 100}
        disabledButton2={!canSubmit}
        submittingButton2={submitting}
      >
        <input
          accept={acceptFileUpload}
          type="file"
          id="select-image"
          style={{ display: 'none' }}
          onChange={(e) => setSelectedImage(e.target.files[0])}
          disabled={selectedImage}
        />
        <label htmlFor="select-image">
          <Button disabled={selectedImage} variant="outlined" color="primary" component="span">
            Upload File
          </Button>
        </label>
        <Box mt={2} textAlign="center" display="flex" alignItems="center" justifyContent="center">
          {selectedImage ? (
            canSubmit ? (
              <img src={DefaultUploadedFileImage} alt={'Uploaded'} height="100px" />
            ) : (
              <LoadingWithLabel value={uploadProgress} color="primary" />
            )
          ) : (
            alreadySubmiited && (
              <img src={DefaultUploadedFileImage} alt={'Uploaded'} height="100px" />
            )
          )}
        </Box>
      </Dialog>

      <AlertSnackbar severity="warning" open={wrongFile} hideIn={hideFileAlertIn}>
        {wrongFile}
      </AlertSnackbar>
    </>
  );
};
