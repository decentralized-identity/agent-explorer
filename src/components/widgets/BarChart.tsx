import React from 'react'
import { Typography } from 'antd'
import Chart from '../standard/Chart'
import { chart2 } from '../../stubbs/chart'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'

interface BarChartProps extends PageWidgetProps {}

const BarChart: React.FC<BarChartProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
}) => {
  return (
    <PageWidget
      title={title}
      isLoading={isLoading}
      remove={remove}
      removeDisabled={removeDisabled}
    >
      <Typography.Text>Configure data using query module</Typography.Text>
      <Chart type="bar" data={chart2} />
    </PageWidget>
  )
}

export default BarChart
