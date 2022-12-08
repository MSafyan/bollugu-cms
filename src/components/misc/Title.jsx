import { Typography } from '@material-ui/core';
import { fullTitle } from 'src/config/settings';

const style = {
  fontFamily: 'Public Sans,sans-serif',
  fontSize: '10px',
  textAlign: 'center',
  paddingTop: '120px',
  paddingLeft: '20px'
};

export default () => {
  return <Typography style={style}>{fullTitle}</Typography>;
};
