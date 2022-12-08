/*
  Imports
*/
import { filter } from 'lodash';
import { useState } from 'react';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

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
    const queryL = query.toLowerCase();
    toSort = filter(
      array,
      (element) =>
        element.name.toLowerCase().indexOf(queryL) !== -1 ||
        element.username.toLowerCase().indexOf(queryL) !== -1 ||
        String(element.attendancePercentage).toLowerCase().indexOf(queryL) !== -1
    );
  }
  return stabilize(toSort, comparator);
}

/*
  Main Working
*/
export default ({ studentData: data, childToParent, editingData }) => {
  /*
      States, Params, Navigation, Query, Variables.
    */
  const TableHeader = [
    { id: 'username', label: 'Roll Number', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' }
  ];

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState(editingData ?? []);
  const [orderBy, setOrderBy] = useState(TableHeader[0].id);
  const [filterName, setFilterName] = useState('');

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

  const handleClick = (_event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);

    childToParent(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.value == 'present') {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      childToParent(newSelecteds);

      return;
    }
    setSelected([]);
    childToParent([]);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  /*
      Main Design.
    */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Students Summary
      </Typography>

      <br />

      <Card>
        <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

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
                attendance={true}
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

                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {username}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="center">
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue={isItemSelected ? 'present' : 'absent'}
                            onChange={(event) => handleClick(event, id)}
                          >
                            <FormControlLabel
                              value="present"
                              control={<Radio checked={isItemSelected} />}
                              label="Present"
                            />
                            <FormControlLabel
                              value="absent"
                              control={<Radio checked={!isItemSelected} />}
                              label="Absent"
                            />
                          </RadioGroup>
                        </FormControl>
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
