import React, { useEffect, useState } from 'react'
import { Typography, Form, Input, Button, Select, Row } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'
import { issueCredential, claimToObject } from '../../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { IIdentifier } from '@veramo/core'
import IssueCredentialFromSchema from '../standard/IssueCredentialFromSchema'

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

interface SelectSchemaAndIssueProps extends PageWidgetProps {}

const SelectSchemaAndIssue: React.FC<SelectSchemaAndIssueProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
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
  const [fields, updateFields] = useState<Field[]>([])
  const [proofFormat, setProofFormat] = useState('jwt')

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const [schemaUrlsList, setSchemaUrlsList] = useState<string[]>([])
  const [selectedSchemaUrl, setSelectedSchemaUrl] = useState<string>('')
  const [schemasLoading, setSchemasLoading] = useState(true)
  const [selectedSchema, setSelectedSchema] = useState<JSON>()

  useEffect(() => {
    const getSchemas = async () => {
      const url = `${schemasRepositoryUrlBase}/index.json`
      const response = await fetch(url, {
        method: 'GET',
      })
      const json = await response.json()
      console.log('json.schemas: ', json.schemas)
      setSchemaUrlsList(json.schemas)
      setSchemasLoading(false)
    }
    getSchemas()
  }, [])

  useEffect(() => {
    const getSchemas = async () => {
      const url = `${schemasRepositoryUrlBase}/${selectedSchemaUrl}`
      const response = await fetch(url, {
        method: 'GET',
      })
      const json = await response.json()
      console.log('json selected schema: ', json)
      setSelectedSchema(json)
    }
    getSchemas()
  }, [selectedSchemaUrl])

  const signVc = async (send?: boolean) => {
    await issueCredential(
      agent,
      issuer,
      subject,
      fields,
      proofFormat,
      customContext,
      credentialType,
    )

    setIssuer('')
    setSubject('')
    updateFields([])
  }

  console.log('schemas: ', schemaUrlsList)
  return (
    <PageWidget
      title={title}
      isLoading={isLoading}
      remove={remove}
      removeDisabled={removeDisabled}
    >
      <Select
        style={{ width: '60%' }}
        loading={schemasLoading}
        onChange={(e) => setSelectedSchemaUrl(e as string)}
        placeholder="Schema"
        defaultActiveFirstOption={true}
      >
        {schemaUrlsList &&
          schemaUrlsList.map((schema: string) => (
            <Option key={schema} value={schema}>
              {schema}
            </Option>
          ))}
      </Select>
      {selectedSchema && <IssueCredentialFromSchema schema={selectedSchema} />}
    </PageWidget>
  )
}

export default SelectSchemaAndIssue
