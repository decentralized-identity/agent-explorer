import React, { Children } from 'react'
import { Card } from 'antd'

interface DynamicModuleProps {
  title: string
  isLoading?: boolean
  remove: () => void
}

const DynamicModule: React.FC<DynamicModuleProps> = ({
  title,
  isLoading,
  children,
  remove,
}) => {
  return (
    <Card title={title} loading={isLoading} draggable onClick={remove}>
      {children}
    </Card>
  )
}

export default DynamicModule
