import { Box, Card, CardHeader } from '@material-ui/core';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from './BaseOptionChart';

export default ({ labels, data, type, title, percent }) => {
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [2, 2, 2] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: type ?? ['gradient', 'gradient', 'solid'] },
    labels,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          return y.toFixed(1) + (percent ? '%' : '');
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return value;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title={title} />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          labels={labels}
          series={data}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
};
