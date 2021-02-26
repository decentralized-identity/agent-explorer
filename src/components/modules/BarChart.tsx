import React from 'react'
import { Typography } from 'antd'
import Chart from '../../components/simple/Chart'
import { chart2 } from '../../stubbs/chart'
import DynamicModule from '../../layout/PageModule'
import { PageModuleProps } from '../../types'

interface BarChartProps extends PageModuleProps {}

const BarChart: React.FC<BarChartProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
}) => {
  return (
    <DynamicModule
      title={title}
      isLoading={isLoading}
      remove={remove}
      removeDisabled={removeDisabled}
    >
      <Typography.Text>Configure data using query module</Typography.Text>
      <Chart type="bar" data={chart2} />
    </DynamicModule>
  )
}

export default BarChart
