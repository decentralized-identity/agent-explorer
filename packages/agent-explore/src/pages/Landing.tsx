import React from 'react'
import { Typography, Space, Col, Row, Avatar } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import { useNavigate } from 'react-router'
import { DIDDiscoveryBar } from '@veramo-community/agent-explorer-plugin'

export const Landing: React.FC = () => {
  const navigate = useNavigate()
  return (
  <PageContainer title={false}>
    <Row>
        <Col md={6}/>
        <Col  
          md={12}
          xs={24}
          style={{position: 'relative'}}
          >
            <Space direction="vertical" style={{width: '100%'}}>
              <Space>
                <Avatar size={'large'} src="https://explore.veramo.io/apple-touch-icon.png" />
                <Typography.Title level={2}>
                  Agent explorer
                </Typography.Title>
              </Space>
              <Typography.Text>
                Start by searching for a DID
              </Typography.Text>

              <DIDDiscoveryBar
                placeholder='did:web:staging.community.veramo.io'
                handleSelect={(value: any) => {
                  navigate('/contacts/' + value)
                }}
              />
            </Space>
          </Col>
        <Col md={6}/>
        </Row>
  </PageContainer>
)}

