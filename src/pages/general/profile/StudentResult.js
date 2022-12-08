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

import Label from 'src/components/misc/Label';
import { getComparator } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead } from '../../../components/misc/table';

/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator, _query) {
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
export default ({ classes }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'name', label: 'Class ID', align: 'left' },
    { id: 'course.name', label: 'Course', align: 'left' },
    { id: 'teacher.name', label: 'Teacher', align: 'left' },
    { id: 'students.total', label: 'Total Marks', align: 'center' },
    { id: 'students.obtained', label: 'Obtained Marks', align: 'center' },
    { id: 'students.attendancePercentage', label: 'Attendance', align: 'center' }
  ];

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);

  const emptyRows = 0;
  const filteredUsers = applySortFilter(classes, getComparator(order, orderBy));
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
      const newSelecteds = classes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /*
    Use Effect Hooks.
  */

  /*
    Main Design.
  */
  return (
    <>
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
                  const {
                    id,
                    name,
                    attendancePercentage,
                    blocked,
                    course,
                    teacher,
                    students,
                    pass
                  } = row;
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
                          ? pass
                            ? palette.background.success
                            : palette.background.locked
                          : palette.background.default
                      }}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{course.name}</TableCell>
                      <TableCell align="left">{teacher.name}</TableCell>
                      <TableCell align="center">{students.total || 1}</TableCell>

                      <TableCell align="center">{students.obtained}</TableCell>
                      <TableCell align="center">
                        <Label
                          style={{
                            textAlign: 'center',
                            width: 'inherit',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          variant="ghost"
                          color={
                            students.attendancePercentage < attendancePercentage
                              ? 'error'
                              : 'success'
                          }
                        >
                          {students.attendancePercentage}%
                        </Label>
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
