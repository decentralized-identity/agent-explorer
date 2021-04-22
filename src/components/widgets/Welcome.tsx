import React from 'react'
import { Typography } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'

interface BarChartProps extends PageWidgetProps {}

const Welcome: React.FC<BarChartProps> = ({
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
      <Typography.Text>
        Hey there, You can customise your dashboard with widgets. When you add
        one below you will be able to remove this one.
      </Typography.Text>
    </PageWidget>
  )
}

export default Welcome
