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
  borderRadius: '2%',
  alignItems: 'center',
  width: theme.spacing(50),
  height: theme.spacing(50),
  justifyContent: 'center',
  marginTop: -20,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.74
  )} 100%)`
}));

export default ({ Image, locked }) => {
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Box
          component="img"
          src={Image}
          sx={{
            borderRadius: '1%',
            width: '95%',
            height: '95%',
            objectFit: 'cover'
          }}
        />
      </IconWrapperStyle>
    </RootStyle>
  );
};
