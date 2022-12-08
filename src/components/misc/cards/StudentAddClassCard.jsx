import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';
import Label from '../Label';
import { CardAvatar } from './CardAvatar';

export default ({ item, onSelection }) => {
  const {
    name,
    image,
    username,
    added,
    courseAdded,
    to,
    selected: select,
    id,
    preReqMissing
  } = item;

  const [selected, setSelected] = useState(select);

  const isUnSelectable = added || courseAdded || preReqMissing;
  const hasLabel = isUnSelectable || selected;

  const handleSelect = () => {
    if (isUnSelectable) return;
    onSelection(id, selected);
    setSelected(!selected);
  };

  let backgroundColor = palette.background.neutral;
  let labelColor = 'info';
  let label = 'Selected';
  if (selected) backgroundColor = palette.info.light;
  if (courseAdded) {
    backgroundColor = palette.secondary.light;
    labelColor = 'secondary';
    label = 'In Course';
  }
  if (added || preReqMissing) {
    backgroundColor = palette.error.light;
    labelColor = 'error';
    label = 'In Class';
    if (preReqMissing) label = 'Pre requist not completed';
  }
  return (
    <Card
      style={{
        backgroundColor
      }}
    >
      <Box onClick={handleSelect} sx={{ pt: '100%', position: 'relative' }}>
        {hasLabel && (
          <Label
            variant="filled"
            color={labelColor}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {label}
          </Label>
        )}
        <CardAvatar alt={name} src={image} />
      </Box>
      <Link target="_blank" to={to} color="inherit" underline="hover" component={RouterLink}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
            <br />
            {username}
          </Typography>
        </Stack>
      </Link>
    </Card>
  );
};
