import { Box, Card, CardHeader } from '@material-ui/core';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from './BaseOptionChart';

export default ({ title, name, data, categories }) => {
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => value + '%'
      },
      x: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2
      }
    },
    xaxis: {
      categories
    }
  });

  return (
    <Card>
      <CardHeader title={title} />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ name, data }]} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
};
