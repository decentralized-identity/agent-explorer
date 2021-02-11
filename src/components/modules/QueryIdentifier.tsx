import React, { useState } from 'react'
import { Input, Row, Col, Typography, Select } from 'antd'
import DynamicModule from '../../layout/DynamicModule'
import SubjectKey from '../widgets/SubjectKey'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { DynamicModuleProps } from '../../types'

const { Text } = Typography
const { Option } = Select

interface QueryIdentifierProps extends DynamicModuleProps {
  title: string
  remove: () => void
}

const QueryIdentifier: React.FC<QueryIdentifierProps> = ({ title, remove }) => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()
  const [queryWidgetKey, setQueryWidgetKey] = useState<string>('')
  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )
  const [queryModuleIdentifier, setQueryModuleIdentifier] = useState(
    credential?.credentialSubject.id,
  )

  return (
    <DynamicModule title={title} isLoading={credentialLoading} remove={remove}>
      <Row>
        <Select
          defaultValue={queryModuleIdentifier}
          style={{ width: 120 }}
          onChange={(identifier) => setQueryModuleIdentifier(identifier)}
        >
          <Option value={credential?.credentialSubject.id as string}>
            Subject
          </Option>
          <Option value={credential?.issuer.id as string}>Issuer</Option>
        </Select>
        <Input
          style={{ margin: '15px 0' }}
          type="text"
          defaultValue="Enter claim type"
          onChange={(e) => setQueryWidgetKey(e.target.value)}
        />
      </Row>

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
    </DynamicModule>
  )
}

export default QueryIdentifier
