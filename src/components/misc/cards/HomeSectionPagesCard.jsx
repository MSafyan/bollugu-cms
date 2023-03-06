import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';
import { FoodPicture } from './FoodPicture';

export default ({ item }) => {
  const { images_list, to } = item;

  const [mouse, setMouse] = useState(false);

  return (
    <Link to={to} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        {images_list && (
          <Box sx={{ pt: '100%', position: 'relative' }}>
            <FoodPicture alt={images_list} src={images_list} />
          </Box>
        )}

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="h5" noWrap>
            {item.template_order}
          </Typography>
          <Typography variant="h5" noWrap>
            {item.template_type}
          </Typography>
          {item.text_one !== 'none' && item.text_one !== '""' && (
            <Typography variant="h5" noWrap>
              {item.text_one}
            </Typography>
          )}
          {item.text_two !== 'none' && item.text_two !== '""' && (
            <Typography variant="h6" noWrap>
              {item.text_two}
            </Typography>
          )}
          {item.text_three !== 'none' && item.text_three !== '""' && (
            <Typography variant="caption" noWrap>
              {item.text_three}
            </Typography>
          )}
        </Stack>
      </Card>
    </Link>
  );
};
