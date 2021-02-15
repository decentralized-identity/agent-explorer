import React from 'react'
import { Card, Button, Collapse } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { PageModuleProps } from '../types'

const PageModule: React.FC<PageModuleProps> = ({
  title,
  isLoading,
  children,
  remove,
  noPadding,
  removeDisabled,
  renderSettings,
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
      bodyStyle={{ padding: 0 }}
    >
      {!removeDisabled && (
        <Button
          shape="round"
          icon={<CloseCircleOutlined size={40} />}
          onClick={remove}
          style={{ position: 'absolute', top: 15, right: 15, border: 0 }}
        />
      )}
      <Card type="inner" bodyStyle={bodyStyle} bordered={false}>
        {children}
      </Card>
      {renderSettings && (
        <Collapse bordered={false}>
          <Collapse.Panel key="0" header="Settings">
            {renderSettings()}
          </Collapse.Panel>
        </Collapse>
      )}
    </Card>
  )
}

export default PageModule
