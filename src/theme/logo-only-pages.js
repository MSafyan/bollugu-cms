import { Card } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Page from '../components/Page';

export const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 85%'
  }
}));

export const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(4, 0, 2, 2)
}));

export const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '96vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));
