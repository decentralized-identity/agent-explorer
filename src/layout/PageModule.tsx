import React from 'react'
import { Card, Button, Collapse, Row, Col } from 'antd'
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
    : { padding: 20 }

  return (
    <Card
      title={title}
      loading={isLoading}
      bordered={noPadding}
      bodyStyle={{ padding: 0, margin: 1 }}
    >
      {!removeDisabled && (
        <Button
          shape="round"
          icon={<CloseCircleOutlined size={40} />}
          onClick={remove}
          style={{ position: 'absolute', top: 15, right: 15, border: 0 }}
        />
      )}
      <div style={bodyStyle}>{children}</div>
      {renderSettings && (
        <Collapse bordered={false} style={{ background: 'none' }}>
          <Collapse.Panel key="0" header="Settings">
            {renderSettings()}
          </Collapse.Panel>
        </Collapse>
      )}
    </Card>
  )
}

export default PageModule
