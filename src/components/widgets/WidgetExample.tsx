import React from 'react'
import { Typography } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'

const WidgetExample: React.FC<PageWidgetProps> = ({
  title,
  isLoading,
  remove,
}) => {
  return (
    <PageWidget title={title} remove={remove} isLoading={isLoading}>
      <Typography.Text>
        Hi I'm a dynamic widget component <b>{title}</b>
      </Typography.Text>
    </PageWidget>
  )
}

export default WidgetExample
