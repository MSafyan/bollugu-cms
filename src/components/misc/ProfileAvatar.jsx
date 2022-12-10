import { Box, Card } from '@material-ui/core';
import { alpha, styled } from '@material-ui/core/styles';
import palette from 'src/theme/palette';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0)
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(40),
  height: theme.spacing(40),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.74
  )} 100%)`
}));

export default ({ Image, locked }) => {
  let style = {};
  if (locked)
    style = {
      backgroundImage: 'none',
      backgroundColor: palette.error.dark
    };

  return (
    <RootStyle>
      <IconWrapperStyle style={style}>
        <Box
          component="img"
          src={Image}
          sx={{
            borderRadius: '50%',
            width: '95%',
            height: '95%',
            objectFit: 'cover'
          }}
        />
      </IconWrapperStyle>
    </RootStyle>
  );
};
