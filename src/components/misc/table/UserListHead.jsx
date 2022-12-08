import PropTypes from 'prop-types';
// material
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import { visuallyHidden } from '@material-ui/utils';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

// ----------------------------------------------------------------------

UserListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func
};

export default function UserListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  hideCheckBoxes,
  attendance
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {!hideCheckBoxes && (
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          )}
        </TableCell>
        {headLabel.map((headCell) => {
          return (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
        {attendance && (
          <TableCell align="center">
            <FormControl>
              <TableSortLabel>Attendance</TableSortLabel>
              <RadioGroup
                indeterminate={numSelected > 0 && numSelected < rowCount}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue="absent"
                onChange={onSelectAllClick}
              >
                <FormControlLabel
                  value="present"
                  control={<Radio checked={rowCount > 0 && numSelected === rowCount} />}
                  label="Present"
                />
                <FormControlLabel
                  value="absent"
                  control={<Radio checked={rowCount > 0 && numSelected === 0} />}
                  label="Absent"
                />
              </RadioGroup>
            </FormControl>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
