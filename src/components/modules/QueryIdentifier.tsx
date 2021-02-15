import React, { useEffect, useState } from 'react'
import { Input, Row, Col, Typography, Select, Button, Form } from 'antd'
import PageModule from '../../layout/PageModule'
import SubjectKey from '../widgets/SubjectKey'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageModuleProps } from '../../types'

const { Text } = Typography
const { Option } = Select

interface QueryIdentifierConfig {
  queryWidgetKey: string
  identifierType: string
}

interface QueryIdentifierProps extends PageModuleProps {
  config: QueryIdentifierConfig
}

const QueryIdentifier: React.FC<QueryIdentifierProps> = ({
  title,
  remove,
  config,
  saveConfig,
}) => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()
  const [saved, setSaved] = useState(true)

  const [_title, setTitle] = useState(title)

  const [queryWidgetKey, setQueryWidgetKey] = useState<string>(
    config.queryWidgetKey,
  )
  const [identifierType, setIdentifierType] = useState<string>(
    config.identifierType || 'subject',
  )

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )
  const [queryModuleIdentifier, setQueryModuleIdentifier] = useState(
    credential?.issuer.id,
  )

  /**
   * Function to save local configs
   */
  const saveModuleSettings = () => {
    const config = {
      queryWidgetKey,
      identifierType,
    }
    saveConfig && saveConfig(config, _title)
  }

  /**
   * Update the DID when the identifierType changes
   */
  useEffect(() => {
    setQueryModuleIdentifier(
      config.identifierType === 'subject'
        ? credential?.credentialSubject.id
        : credential?.issuer.id,
    )
  }, [identifierType])

  /**
   * Check if the state has been persisted and show in UI
   */
  useEffect(() => {
    if (
      queryWidgetKey !== config.queryWidgetKey ||
      _title !== title ||
      config.identifierType !== identifierType
    ) {
      setSaved(false)
    }
  }, [queryWidgetKey, _title])

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 4,
      },
    },
  }

  return (
    <PageModule
      title={_title}
      isLoading={credentialLoading}
      remove={remove}
      renderSettings={() => (
        <>
          <Form {...formItemLayout}>
            <Form.Item label="Module label">
              <Input
                type="text"
                defaultValue={_title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Identifier Type">
              <Select
                defaultValue={config.identifierType || 'subject'}
                style={{ width: 120 }}
                onChange={(identifierType) => setIdentifierType(identifierType)}
              >
                <Option key="0" value="issuer">
                  Subject
                </Option>
                <Option key="1" value="subject">
                  Issuer
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label="Claim Query">
              <Input
                type="text"
                defaultValue={config.queryWidgetKey || 'Enter claim value'}
                onChange={(e) => setQueryWidgetKey(e.target.value)}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button onClick={() => saveModuleSettings()} disabled={saved}>
                Save settings
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    >
      <SubjectKey
        did={queryModuleIdentifier as string}
        vcKey={queryWidgetKey}
        renderKey={(hash, data) => {
          return (
            <Row>
              <Col>
                {hash ? (
                  <>
                    <Text>
                      Most recent <b>{queryWidgetKey}</b> claim:
                    </Text>
                    <br />
                    <br />
                    <pre>
                      <code>{JSON.stringify(data, null, 2)}</code>
                    </pre>
                  </>
                ) : (
                  <Text>
                    No credentials for <b>{queryWidgetKey}</b>
                  </Text>
                )}
              </Col>
            </Row>
          )
        }}
      />
    </PageModule>
  )
}

export default QueryIdentifier
