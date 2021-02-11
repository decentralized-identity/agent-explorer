import React from 'react'
import { Card, Typography } from 'antd'
import DynamicModule from '../../layout/DynamicModule'
import { DynamicModuleProps } from '../../types'

const DynamicModule002: React.FC<DynamicModuleProps> = ({
  title,
  isLoading,
  remove,
}) => {
  return (
    <DynamicModule title={title} remove={remove} isLoading={isLoading}>
      <Typography.Text>
        Hi I'm a dynamic module <b>{title}</b>
      </Typography.Text>
    </DynamicModule>
  )
}

export default DynamicModule002
