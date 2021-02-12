import React, { useEffect, useState } from 'react'
import { Input, Row, Col, Typography, Select, Button } from 'antd'
import PageModule from '../../layout/PageModule'
import SubjectKey from '../widgets/SubjectKey'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageModuleProps } from '../../types'

const { Text } = Typography
const { Option } = Select

interface QueryIdentifierProps extends PageModuleProps {}

const QueryIdentifier: React.FC<QueryIdentifierProps> = ({
  title,
  remove,
  config,
  saveConfig,
}) => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()
  const [queryWidgetKey, setQueryWidgetKey] = useState<string>(
    config.queryWidgetKey,
  )
  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )
  const [queryModuleIdentifier, setQueryModuleIdentifier] = useState(
    credential?.issuer.id,
  )

  const updateQueryIdentifier = (identifierType: string) => {
    if (identifierType === 'Subject') {
      setQueryModuleIdentifier(credential?.credentialSubject.id)
    } else {
      setQueryModuleIdentifier(credential?.issuer.id)
    }
  }

  const saveModuleSettings = () => {
    const config = {
      queryWidgetKey,
    }

    saveConfig && saveConfig(config, 'Moondust')
  }

  // useEffect(() => {
  //   saveModuleSettings()
  // }, [queryWidgetKey])

  return (
    <PageModule title={title} isLoading={credentialLoading} remove={remove}>
      <Row>
        <Select
          defaultValue={'Issuer'}
          style={{ width: 120 }}
          onChange={(identifierType) => updateQueryIdentifier(identifierType)}
        >
          <Option key="0" value="Issuer">
            Subject
          </Option>
          <Option key="1" value="Subject">
            Issuer
          </Option>
        </Select>
        <Input
          style={{ margin: '15px 0' }}
          type="text"
          defaultValue={config.queryWidgetKey || 'Enter claim value'}
          onChange={(e) => setQueryWidgetKey(e.target.value)}
        />
      </Row>

      <Button onClick={() => saveModuleSettings()}>Save settings</Button>

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
                      Found most recent <b>{queryWidgetKey}</b> claim:
                    </Text>
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
