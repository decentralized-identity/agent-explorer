import React from 'react'
import { Card, Typography } from 'antd'
import Chart from '../../components/simple/Chart'
import { chart2 } from '../../stubbs/chart'
import DynamicModule from '../../layout/DynamicModule'

interface BarChartProps {
  title: string
  isLoading?: boolean
  remove: () => void
}

const BarChart: React.FC<BarChartProps> = ({ title, isLoading, remove }) => {
  return (
    <DynamicModule title={title} isLoading={isLoading} remove={remove}>
      <Typography.Text>Configure data using query module</Typography.Text>
      <Chart type="bar" data={chart2} />
    </DynamicModule>
  )
}

export default BarChart
