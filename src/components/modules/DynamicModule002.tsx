import React from 'react'
import { Card, Typography } from 'antd'

interface DynamicModuleProps {
  title: string
  isLoading?: boolean
  remove?: () => void
}

const DynamicModule: React.FC<DynamicModuleProps> = ({
  title,
  isLoading,
  remove,
}) => {
  return (
    <Card title={title} loading={isLoading} draggable onClick={remove}>
      <Typography.Text>Hi I'm a dynamic module</Typography.Text>
    </Card>
  )
}

export default DynamicModule
