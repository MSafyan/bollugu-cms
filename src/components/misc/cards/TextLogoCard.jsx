import { Icon } from '@iconify/react';
// material
import { alpha, Card, Typography } from '@material-ui/core';
import { styled } from '@material-ui/styles';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

export default ({ color, backgroundColor, title, icon, amount, noAmount }) => {
  const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(noAmount ? 10 : 5, 0),
    [theme.breakpoints.up('xs')]: {
      padding: theme.spacing(noAmount ? 1 : 5, 0)
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(noAmount ? 10 : 5, 0)
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(noAmount ? 10 : 5, 0)
    },
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(noAmount ? 10 : 5, 0)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(noAmount ? 10 : 5, 0)
    },
    color,
    backgroundColor
  }));

  const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    color,
    backgroundImage: `linear-gradient(135deg, ${alpha(color, 0)} 0%, ${alpha(color, 0.24)} 100%)`
  }));
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={icon} width={24} height={24} />
      </IconWrapperStyle>
      {!noAmount && <Typography variant="h3">{fShortenNumber(amount)}</Typography>}
      <Typography variant={noAmount ? 'h3' : 'subtitle2'} sx={{ opacity: noAmount ? 1 : 0.72 }}>
        {title}
      </Typography>
    </RootStyle>
  );
};
