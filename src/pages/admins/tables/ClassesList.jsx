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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Label from 'src/components/misc/Label';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../../components/misc/table';
import classService from '../../../services/ClassService';

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
        element.teacher.name.toLowerCase().indexOf(queryL) !== -1 ||
        element.course.name.toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ ended }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'name', label: 'Class', align: 'left' },
    { id: 'teacher.name', label: 'Teacher', align: 'left' },
    { id: 'course.name', label: 'Course', align: 'left' },
    { id: 'students.length', label: 'Students', align: 'left' },
    { id: 'attendance.length', label: 'Classes', align: 'left' },
    { id: 'pass', label: ended ? 'Passed' : 'Passing', align: 'left' },
    { id: 'fail', label: ended ? 'Failed' : 'Failing', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const batchID = useParams().bid;

  const navigate = useNavigate();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  /*
    Handlers, Functions
  */
  const getData = () => {
    setLoading(true);
    classService
      .getAll(batchID, 0, 400, [
        'teacher.user',
        'course',
        'students',
        'attendances.students',
        'marks.marks.student'
      ])
      .then((c) => {
        setData(c);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design.
  */
  return (
    <>
      {loading ? (
        <CenterLoading />
      ) : (
        <>
          <ListPageTitle>Classes</ListPageTitle>
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
                        const {
                          id,
                          teacher,
                          course,
                          name,
                          blocked,
                          students,
                          attendance,
                          pass,
                          fail
                        } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;

                        return (
                          <TableRow
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
                              {/* <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              /> */}
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{teacher?.name}</TableCell>
                            <TableCell align="left">{course?.name}</TableCell>
                            <TableCell align="center">{students?.length}</TableCell>
                            <TableCell align="center">{attendance?.length}</TableCell>
                            <TableCell align="center">
                              <Label variant="ghost" color="success">
                                {pass}
                              </Label>
                            </TableCell>
                            <TableCell align="center">
                              <Label variant="ghost" color="error">
                                {fail}
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
      )}
    </>
  );
};
