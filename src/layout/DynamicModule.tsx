import React from 'react'
import { Card, Button } from 'antd'
import { CloseSquareOutlined } from '@ant-design/icons'
import { DynamicModuleProps } from '../types'

const DynamicModule: React.FC<DynamicModuleProps> = ({
  title,
  isLoading,
  children,
  remove,
  noPadding,
}) => {
  const bodyStyle = noPadding
    ? {
        padding: 0,
      }
    : {}

  return (
    <Card
      title={title}
      loading={isLoading}
      bordered={noPadding}
      bodyStyle={bodyStyle}
    >
      <Button
        icon={<CloseSquareOutlined />}
        onClick={remove}
        style={{ position: 'absolute', top: 15, right: 15 }}
      />
      {children}
    </Card>
  )
}

export default DynamicModule
