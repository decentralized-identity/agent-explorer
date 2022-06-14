import React, { useState } from 'react'
import { Input, Button, Select, Card, Alert } from 'antd'
import { issueCredential } from '../../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@veramo/core'

import { withTheme } from '@rjsf/core'
import { Theme as AntDTheme } from '@rjsf/antd'
import { VCJSONSchema } from '../../types'
const JsonSchemaForm = withTheme(AntDTheme)

const { Option } = Select

interface Field {
  type: string
  value: any
}

interface IssueCredentialFromSchemaProps {
  schema: VCJSONSchema
}

const IssueCredentialFromSchema: React.FC<IssueCredentialFromSchemaProps> = ({
  schema,
}) => {
  const { agent } = useVeramo()
  const [errorMessage, setErrorMessage] = useState<null | string>()
  const [sending] = useState(false)
  const [issuer, setIssuer] = useState<string>('')
  const [subject, setSubject] = useState<string>()

  const [formData, setFormData] = useState<any>({})

  const [proofFormat, setProofFormat] = useState('jwt')

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const signVc = async (fields: Field[]) => {
    try {
      const res = await issueCredential(
        agent,
        issuer,
        subject,
        fields,
        proofFormat,
        schema.id,
        schema.name,
      )
      console.log('res: ', res)
      setIssuer('')
      setSubject('')
      setFormData({})
    } catch (error: any) {
      console.error('ex: ', error)
      setErrorMessage(error.toString())
    }
  }

  return (
    <Card>
      <JsonSchemaForm
        schema={(schema as any).schema}
        formData={formData}
        onChange={(e) => {
          setFormData(e.formData)
        }}
        onError={() => {}}
      >
        <Input
          value={subject}
          placeholder="subject DID"
          style={{ width: '60%' }}
          onChange={(e) => setSubject(e.target.value)}
        />
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

        <br />
        <br />

        <Button
          type="primary"
          onClick={() => {
            setErrorMessage('')
            const fields: Field[] = []
            for (let key in formData as any) {
              fields.push({ type: key, value: (formData as any)[key] })
            }
            signVc(fields)
          }}
          style={{ marginRight: 5 }}
          disabled={sending || !subject || !issuer || !proofFormat}
        >
          Issue
        </Button>
        {errorMessage && (
          <>
            <br />
            <br />
            <Alert message={errorMessage} type="error" />
          </>
        )}
      </JsonSchemaForm>
    </Card>
  )
}

export default IssueCredentialFromSchema
