/*
    Imports
*/
import { Card, CardHeader } from '@material-ui/core';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { ChartWrapperStyle } from 'src/theme/charts';
import palette from 'src/theme/palette';
import { fNumber } from '../../utils/formatNumber';
import BaseOptionChart from './BaseOptionChart';

/*
    Main Working
*/
export default function PassFailChart({ title, data, labels, type = 'donut' }) {
  const chartOptions = merge(BaseOptionChart(), {
    colors: [palette.success.dark, palette.error.dark],
    labels,
    stroke: { colors: [palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: type == 'pie' ? -10 : 0
        },
        donut: {
          size: 60,
          labels: {
            show: true,
            name: { color: type == 'pie' ? 'white' : 'black' },
            total: { color: type == 'pie' ? 'white' : 'black' }
          }
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title={title} />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type={type} series={data} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
