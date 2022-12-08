/*
  Imports
*/
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import { useState } from 'react';

import { getComparator } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead } from '../../../components/misc/table';

/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

/*
  Main Working
*/
export default ({ classes, user }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'batch.year', label: 'Batch', align: 'left' },
    { id: 'name', label: 'Class', align: 'left' },
    { id: 'course.code', label: 'Course ID', align: 'left' },
    { id: 'course.name', label: 'Course', align: 'center' },
    { id: 'students.length', label: 'Students', align: 'center' },
    { id: 'attendance.length', label: 'Classes', align: 'center' }
  ];

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);

  const emptyRows = 0;
  const filteredUsers = applySortFilter(classes, getComparator(order, orderBy));
  const isUserNotFound = filteredUsers.length === 0;

  const { qualification, experience, subjects } = user;

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
      const newSelecteds = classes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /*
    Main Design.
  */
  return (
    <>
      <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Qualification: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{qualification}</Typography>
        </Grid>

        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Experience: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{experience}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Subject(s): </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{subjects}</Typography>
        </Grid>
      </Grid>
      <br />
      <br />

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TableHeader}
                rowCount={classes.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                hideCheckBoxes={true}
              />
              <TableBody>
                {filteredUsers.map((row) => {
                  const { id, blocked, course, batch, students, name, attendance } =
                    row;
                  const isItemSelected = selected.indexOf(id) !== -1;

                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      style={{
                        backgroundColor: blocked
                          ? palette.background.locked
                          : palette.background.default
                      }}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {batch.year}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="left">{course.code}</TableCell>
                      <TableCell align="left">{course.name}</TableCell>
                      <TableCell align="center">{students.length}</TableCell>
                      <TableCell align="center">{attendance.length}</TableCell>
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
                      <SearchNotFound classes={true} />
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
