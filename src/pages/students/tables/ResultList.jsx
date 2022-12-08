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
import { Link, useNavigate } from 'react-router-dom';

import Label from 'src/components/misc/Label';
import { ViewIcon } from 'src/config/icons';
import { getComparator, stabilize } from 'src/utils/table';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserMoreMenu } from '../../../components/misc/table';

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
export default ({ classes: data }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'course.code', label: 'Course ID', align: 'left' },
    { id: 'course.name', label: 'Course', align: 'left' },
    { id: 'student.total', label: 'Total Marks', align: 'center' },
    { id: 'student.obtained', label: 'Obtained Marks', align: 'center' }
  ];

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);

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
                  const { id, course, name, student } = row;

                  return (
                    <TableRow
                      hover
                      component={Link}
                      to={`../${name}`}
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      style={{
                        textDecoration: 'none'
                      }}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {course?.code}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">{course?.name}</TableCell>
                      <TableCell align="center">{student.total}</TableCell>
                      <TableCell align="center">
                        <Label
                          variant="ghost"
                          color={student.totalFactor >= 0.5 ? 'success' : 'error'}
                        >
                          {student.obtained}
                        </Label>
                      </TableCell>

                      <TableCell align="right" onClick={handleMoreMenuCell}>
                        <UserMoreMenu ID={[name, id]} Options={MORE_MENU} />
                      </TableCell>
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
