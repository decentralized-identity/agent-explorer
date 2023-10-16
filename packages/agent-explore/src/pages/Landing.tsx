import React from 'react'
import { Typography, Input, Space, Col, Row, Avatar } from 'antd'

import { PageContainer } from '@ant-design/pro-components'
import { useNavigate } from 'react-router'

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

              <Input.Search
                  // placeholder="did:web:staging.community.veramo.io"
                  defaultValue={'did:web:staging.community.veramo.io'}
                  onSearch={(value) => navigate('/contacts/' + value)}
                  style={{ width: '100%', marginBottom: 20 }}
                />
            </Space>
            
          </Col>
        <Col md={6}/>
        </Row>



  </PageContainer>
)}

