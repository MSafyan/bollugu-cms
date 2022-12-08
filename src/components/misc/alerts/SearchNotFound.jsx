import { Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ classes, data, searchQuery = '', ...other }) {
  let description = `No results found for: '${searchQuery}'. Try checking for typos or using complete words.`;

  if (classes) description = 'No classes registered';

  if (data) description = 'No data found';
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Not found
      </Typography>
      <Typography variant="body2" align="center">
        {description}
      </Typography>
    </Paper>
  );
}
