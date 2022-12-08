import PropTypes from 'prop-types';
// material
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import {
  Timeline as TL,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@material-ui/lab';
// utils
import { formatDistanceToNow } from 'date-fns';
import { randomColor } from 'src/utils/misc';
import { UserMoreMenu } from './table';
import React from 'react';

Item.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function Item({ item, isLast, more }) {
  const { details, date, id } = item;

  const detailsA = [];
  for (let i = 0; i < details.length; i += 90) {
    detailsA.push(details.slice(i, i + 90));
  }
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor: randomColor()
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        {React.Children.toArray(
          detailsA.map((d) => <Typography variant="subtitle2">{d}</Typography>)
        )}
        <div style={{ float: 'right' }}>{more && <UserMoreMenu ID={[id]} Options={more} />}</div>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatDistanceToNow(new Date(date))}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function Timeline({ title, data, more }) {
  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title={title} />
      <CardContent>
        <TL>
          {data.map((item, index) => (
            <Item key={item.title} item={item} isLast={index === data.length - 1} more={more} />
          ))}
        </TL>
      </CardContent>
    </Card>
  );
}
