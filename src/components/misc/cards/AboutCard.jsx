import { Box, Card, Grid, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ColorBox } from 'src/pages/admins/forms/AboutForm';
import palette from 'src/theme/palette';

export default ({ item, type }) => {
  const {
    phoneNumber,
    email,
    tagline,
    address,
    countryList,
    metaDescription,
    activeBackground,
    inactiveBackground,
    to
  } = item;
  const [mouse, setMouse] = useState(false);

  const overviewList = [
    { title: 'Phone Number', value: phoneNumber },
    { title: 'Email', value: email },
    { title: 'Tagline', value: tagline },
    { title: 'Address', value: address }
  ];

  return (
    <Link to={`${to}/edit?type=${type}`} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        {type === 'background' && (
          <Stack spacing={1} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left'
              }}
            >
              <Typography variant="h5" noWrap>
                {`background:`}
              </Typography>
              <ColorBox color={activeBackground.color} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left'
              }}
            >
              <Typography variant="h5" noWrap>
                {`Inactive Background:`}
              </Typography>
              <ColorBox color={inactiveBackground.color} />
            </Box>
          </Stack>
        )}
        {type === 'overview' && (
          <Stack spacing={1} sx={{ p: 3 }}>
            {overviewList.map((item, index) => (
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="h5" noWrap>
                    {`${item.title}:`}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" noWrap>
                    {` ${item.value}`}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Stack>
        )}
        {type === 'description' && (
          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography variant="h5" noWrap>
              {`Meta Description:`}
            </Typography>
            <Typography variant="body1" noWrap>
              {` ${metaDescription}`}
            </Typography>
          </Stack>
        )}
        {type == 'map' && (
          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography variant="h5" noWrap>
              {`Country List:`}
            </Typography>
            <Typography variant="body1" noWrap>
              {`${countryList?.length} countries`}
            </Typography>
          </Stack>
        )}
      </Card>
    </Link>
  );
};
