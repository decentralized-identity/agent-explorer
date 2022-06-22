import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { VCJSONSchema, PageWidgetProps } from '../../types'
import IssueCredentialFromSchema from '../standard/IssueCredentialFromSchema'

const { Option } = Select

const schemasRepositoryUrlBase = 'https://veramolabs.github.io/vc-json-schemas'

interface SelectSchemaAndIssueProps extends PageWidgetProps {}

const SelectSchemaAndIssue: React.FC<SelectSchemaAndIssueProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
}) => {
  const [schemaUrlsList, setSchemaUrlsList] = useState<string[]>([])
  const [selectedSchemaUrl, setSelectedSchemaUrl] = useState<string>('')
  const [schemasLoading, setSchemasLoading] = useState(true)
  const [selectedSchema, setSelectedSchema] = useState<VCJSONSchema>()

  // load schemas from repo
  useEffect(() => {
    const getSchemas = async () => {
      const url = `${schemasRepositoryUrlBase}/index.json`
      const response = await fetch(url, {
        method: 'GET',
      })
      const json = await response.json()
      setSchemaUrlsList(json.schemas)
      setSchemasLoading(false)
    }
    getSchemas()
  }, [])

  // load selected schema
  useEffect(() => {
    const getSchemas = async () => {
      if (selectedSchemaUrl) {
        const url = `${schemasRepositoryUrlBase}/${selectedSchemaUrl}`
        const response = await fetch(url, {
          method: 'GET',
        })
        try {
          const json = await response.json()
          setSelectedSchema(json)
        } catch (err) {
          console.log('Error Setting Schemas: ', err)
        }
      }
    }
    getSchemas()
  }, [selectedSchemaUrl])

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
