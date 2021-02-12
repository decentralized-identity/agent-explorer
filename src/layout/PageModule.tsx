import React from 'react'
import { Card, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { PageModuleProps } from '../types'

const PageModule: React.FC<PageModuleProps> = ({
  title,
  isLoading,
  children,
  remove,
  noPadding,
  removeDisabled,
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
      {!removeDisabled && (
        <Button
          shape="round"
          icon={<CloseCircleOutlined size={40} />}
          onClick={remove}
          style={{ position: 'absolute', top: 15, right: 15, border: 0 }}
        />
      )}

      {children}
    </Card>
  )
}

export default PageModule
