import { Grid, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Title from 'src/components/misc/Title';
import { MHidden } from '../components/@material-extend';
import Logo from '../components/Logo';

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

// ----------------------------------------------------------------------

AuthLayout.propTypes = {
  children: PropTypes.node
};

export default function AuthLayout({ children, image }) {
  return (
    <>
      <HeaderStyle>
        {/* <RouterLink to="/"> */}
        <Logo />
        {/* </RouterLink> */}
        <MHidden width="smDown">
          <Typography
            variant="body2"
            sx={{
              mt: { md: -2 }
            }}
          >
            {children}
          </Typography>
        </MHidden>
      </HeaderStyle>
      <Title />
      <Grid sx={{ pt: 6 }}>
        {' '}
        <img src={image} alt="" />
      </Grid>
    </>
  );
}
