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
import { ViewIcon } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';

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
        element.course.name.toLowerCase().indexOf(queryL) !== -1 ||
        element.teacher.name.toLowerCase().indexOf(queryL) !== -1 ||
        String(element.students[0].attendancePercentage).toLowerCase().indexOf(queryL) !== -1 ||
        String(element.students[0].obtained).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ classes: data }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'name', label: 'Class', align: 'left' },
    { id: 'course.code', label: 'Course ID', align: 'left' },
    { id: 'course.name', label: 'Course', align: 'left' },
    { id: 'teacher.name', label: 'Teacher', align: 'left' },
    { id: 'student.attendancePercentage', label: 'Attendance', align: 'left' },
    { id: 'student.obtained', label: 'Current Marks', align: 'left' }
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
    navigate(`../${ID}`);
  };

  /*
    Table View More Variables
  */

  const MORE_MENU = [{ text: 'View', icon: ViewIcon, event: handleView, id: 0 }];

  /*
    Use Effect Hooks.
  */

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
                    const { id, teacher, course, name, blocked, student, attendancePercentage } =
                      row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        component={Link}
                        to={`../${name}`}
                        key={id}
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
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{course?.code}</TableCell>
                        <TableCell align="left">{course?.name}</TableCell>
                        <TableCell align="left">{teacher?.name}</TableCell>

                        <TableCell align="center">
                          <Label
                            variant="ghost"
                            color={
                              student.attendancePercentage >= attendancePercentage
                                ? 'success'
                                : 'error'
                            }
                          >
                            {student.attendancePercentage}%
                          </Label>
                        </TableCell>
                        <TableCell align="center">
                          <Label
                            variant="ghost"
                            color={student.totalFactor >= 0.5 ? 'success' : 'error'}
                          >
                            {student.obtained}/{student.total}
                          </Label>
                        </TableCell>

                        <TableCell align="right" onClick={handleMoreMenuCell}>
                          <UserMoreMenu ID={[name, id]} Options={MORE_MENU} />
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
