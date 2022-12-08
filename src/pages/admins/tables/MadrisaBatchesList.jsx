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
  TableRow
} from '@material-ui/core';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import { ViewIcon } from 'src/config/icons';
import { defaultPerPage, rowsPerPageList } from 'src/config/settings';
import { getComparator, stabilize } from 'src/utils/table';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/misc/table';
import batchService from '../../../services/BatchService';

/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator, query) {
  let toSort = array;
  if (query) {
    const queryL = query.toLowerCase();
    toSort = filter(array, (element) => String(element.year).toLowerCase().indexOf(queryL) !== -1);
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const TableHeader = [
    { id: 'year', label: 'Batch', align: 'left' },
    { id: 'students', label: 'Students', align: 'left' },
    { id: 'sections', label: 'Sections', align: 'left' },
    { id: 'classes', label: 'Classes', align: 'left' }
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const madrisaID = useParams().mid;

  const navigate = useNavigate();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  /*
    Handlers, Functions
  */
  const getData = () => {
    setLoading(true);
    batchService
      .getAll(madrisaID, 0, 400, ['sections.students', 'classes'])
      .then((batches) => {
        for (const element of batches) {
          const sections = element.sections;
          element.students = 0;
          for (const section of sections) {
            element.students += section.students.length;
          }
        }
        setData(batches);
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

  const handleMoreMenuCell = (event) => {
    event.preventDefault();
  };

  const handleView = (ID) => {
    navigate(`./${ID}`);
  };

  /*
    Table View More Variables
  */
  const MORE_MENU = [{ text: 'View Classes', icon: ViewIcon, event: handleView, id: 0 }];

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
                        const { id, year, students, sections, classes } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;

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
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell align="left">{year}</TableCell>
                            <TableCell align="left">{students}</TableCell>
                            <TableCell align="left">{sections.length}</TableCell>
                            <TableCell align="left">{classes.length}</TableCell>
                            <TableCell align="right" onClick={handleMoreMenuCell}>
                              <UserMoreMenu ID={[id]} Options={MORE_MENU} />
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
