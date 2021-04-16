import React from 'react'
import { Typography } from 'antd'
import Chart from '../../components/simple/Chart'
import { chart2 } from '../../stubbs/chart'
import DynamicModule from '../../layout/PageModule'
import { PageModuleProps } from '../../types'

interface BarChartProps extends PageModuleProps {}

const Welcome: React.FC<BarChartProps> = ({
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
      <Typography.Text>
        Default welcome module. This will have instructions but you can delete
        this and add your own modules using the picker below.
      </Typography.Text>
    </DynamicModule>
  )
}

export default Welcome
