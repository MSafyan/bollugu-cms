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
  TextField
} from '@material-ui/core';
import { filter } from 'lodash';
import { useState } from 'react';

import { Field } from 'formik';
import { getComparator, stabilize } from 'src/utils/table';
import palette from 'src/theme/palette';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/misc/alerts/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../../../components/misc/table';

/*
  Global Variables, Functions
*/

function applySortFilter(array, comparator, query) {
  let toSort = array;
  if (query) {
    toSort = filter(
      array,
      (element) =>
        element.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        element.username.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ studentsData: data, dataFromTable, editingData }) => {
  /*
      States, Params, Navigation, Query, Variables.
    */
  const TableHeader = [
    { id: 'username', label: 'Roll Number', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'marks', label: 'Obtained Marks', align: 'center' }
  ];

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');
  const [dataFinal, setDataFinal] = useState([]);

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

  const handleSelectAllClick = (_event) => {
    const newSelecteds = data.map((n) => n.name);
    setSelected(newSelecteds);
  };

  const handleClick = (event, name) => {
    let value = Number(event.target.value);
    let obj = { student: name, obtained: value };
    const newData = [...dataFinal];

    let alreadyExist = newData.find((o) => o.student == obj.student);
    if (alreadyExist) newData.find((o) => o.student == obj.student).obtained = obj.obtained;
    else newData.push(obj);

    setDataFinal(newData);
    dataFromTable(newData);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  /*
      Table View More Variables
    */

  /*
      Main Design.
    */
  return (
    <>
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
                {filteredUsers.map((row) => {
                  const { id, username, name } = row;
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
                        backgroundColor: palette.background.default
                      }}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell align="left">{username}</TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="center">
                        {!editingData && (
                          <Field
                            name="marks"
                            component={TextField}
                            type="number"
                            inputProps={{ min: 0, inputMode: 'numeric' }}
                            onBlur={(event) => {
                              handleClick(event, id);
                            }}
                          />
                        )}

                        {editingData && (
                          <Field
                            name="marks"
                            component={TextField}
                            type="number"
                            inputProps={{ min: 0, inputMode: 'numeric' }}
                            onBlur={(event) => {
                              handleClick(event, id);
                            }}
                            defaultValue={editingData.find((o) => o.sid == row.id).obtained}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      </Card>
    </>
  );
};
