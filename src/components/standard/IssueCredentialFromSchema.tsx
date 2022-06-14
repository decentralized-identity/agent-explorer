import React, { useEffect, useState } from 'react'
import { Typography, Form, Input, Button, Select, Row, Card } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'
import { issueCredential, claimToObject } from '../../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { IIdentifier } from '@veramo/core'
import JsonSchemaForm from '@rjsf/core'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}

const schemasRepositoryUrlBase = 'https://veramolabs.github.io/vc-json-schemas'

interface Field {
  type: string
  value: any
}

interface IssueCredentialFromSchemaProps {
  schema: JSON
}

const IssueCredentialFromSchema: React.FC<IssueCredentialFromSchemaProps> = ({
  schema,
}) => {
  const { agent } = useVeramo()
  const [claimType, setClaimType] = useState<string>('')
  const [claimValue, setClaimValue] = useState<string>('')
  const [credentialType, setCredentialType] = useState<string>('')
  const [customContext, setCustomContext] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<null | string>()
  const [sending] = useState(false)
  const [issuer, setIssuer] = useState<string>('')
  const [subject, setSubject] = useState<string>()
  // const [fields, updateFields] = useState<Field[]>([])
  // const [somethingElse, updateSomethingElse] = useState<Field[]>([])
  const [proofFormat, setProofFormat] = useState('jwt')

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const signVc = async (fields: Field[], send?: boolean) => {
    console.log('fields: ', fields)
    const res = await issueCredential(
      agent,
      issuer,
      subject,
      fields,
      proofFormat,
      customContext,
      credentialType,
    )
    console.log('res: ', res)
    setIssuer('')
    setSubject('')
    // updateFields([])
  }

  return (
    <Card>
      <Typography.Text>Credential preview</Typography.Text>
      <br />
      <br />
      <Form {...formItemLayout}>
        <Form.Item>
          <Input
            value={subject}
            placeholder="subject DID"
            style={{ width: '60%' }}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            style={{ width: '60%' }}
            loading={identifiersLoading}
            onChange={(e) => setIssuer(e as string)}
            placeholder="issuer DID"
            defaultActiveFirstOption={true}
          >
            {identifiers &&
              identifiers.map((id: IIdentifier) => (
                <Option key={id.did} value={id.did as string}>
                  {id.did}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Select
            style={{ width: '60%' }}
            onChange={(e) => setProofFormat(e as string)}
            placeholder="jwt or lds"
            defaultActiveFirstOption={true}
          >
            <Option key={'jwt'} value="jwt">
              jwt
            </Option>
            <Option key="lds" value="lds">
              lds
            </Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <JsonSchemaForm
            schema={(schema as any).schema}
            onChange={(e) => {
              console.log('onChange e: ', e)
            }}
            onSubmit={(e: any) => {
              e.preventDefault()
              console.log('e: ', e)
              const fields: Field[] = []
              for (let key in e.formData as any) {
                console.log('key: ', key)
                console.log('value: ', (e.formData as any)[key])
                fields.push({ type: key, value: (e.formData as any)[key] })
              }
              //updateSomethingElse(fields);
              console.log('e: ', e)
              signVc(fields)
            }}
            onError={() => {}}
          />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default IssueCredentialFromSchema
