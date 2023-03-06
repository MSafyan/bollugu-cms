import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';
import { FoodPicture } from './FoodPicture';

export default ({ item }) => {
  const { title, svg, to } = item;
  const [fileData, setFileData] = useState(null);

  const [mouse, setMouse] = useState(false);

  useEffect(() => {
    if (svg) {
      fetch(svg)
        .then((response) => response.text())
        .then((data) => setFileData(data));
    }
  }, [svg]);

  return (
    <Link to={`${to}/edit`} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Stack spacing={1} sx={{ p: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <ShowFileContent file={svg} digits={100} />
          </Box>

          <Typography variant="h5" noWrap>
            {title ?? 'Sitemap Here'}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
};

export const ShowFileContent = ({ file, digits = 100 }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (file) {
      fetch(file)
        .then((response) => response.text())
        .then((data) => setFileData(data));
    }
  }, [file]);

  return fileData && <Typography>{fileData.slice(0, digits)}</Typography>;
};
