import React, { useState } from 'react'
import { Typography, Form, Input, Button, Checkbox, Row } from 'antd'
import DynamicModule from '../../layout/PageModule'
import { PageModuleProps } from '../../types'
import { issueCredential, claimToObject } from '../../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

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

interface Field {
  type: string
  value: any
}

interface BarChartProps extends PageModuleProps {}

const IssueCredential: React.FC<BarChartProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
}) => {
  const { agent } = useVeramo()
  const [claimType, setClaimType] = useState<string>('')
  const [claimValue, setClaimValue] = useState<string>('')
  const [credentialType, setCredentialType] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<null | string>()
  const [sending, setSending] = useState(false)
  const [issuer, setIssuer] = useState<string>()
  const [subject, setSubject] = useState<string>()
  const [fields, updateFields] = useState<Field[]>([])

  const updateClaimFields = (field: Field) => {
    const claimTypes = fields.map((field: Field) => field.type)
    const newfields = fields.concat([field])
    setErrorMessage(null)

    if (!field.type) {
      setErrorMessage('Enter claim type')
      return
    }

    if (!field.value) {
      setErrorMessage('Enter claim value')
      return
    }

    if (claimTypes.includes(field.type)) {
      setErrorMessage('Claim type already exists')
      return
    }

    updateFields(newfields)
    setClaimValue('')
    setClaimType('')
  }

  const removeClaimField = (index: number) => {
    const updatedClaims = fields.filter((item: any, i: number) => i !== index)
    updateFields(updatedClaims)
  }

  const signVc = async (send?: boolean) => {
    const credential = await issueCredential(
      agent,
      issuer,
      subject,
      fields,
      credentialType,
    )

    setIssuer('')
    setSubject('')
    updateFields([])

    if (send) {
      sendVC(credential)
    }
  }

  const sendVC = async (body: any) => {
    try {
      await agent?.sendMessageDIDCommAlpha1({
        data: { to: subject as string, from: issuer as string, type: '', body },
        save: true,
      })
    } catch (err) {
      console.log(err)

      agent?.handleMessage({ raw: body.proof.jwt, save: true })
    }
  }

  return (
    <DynamicModule
      title={title}
      isLoading={isLoading}
      remove={remove}
      removeDisabled={removeDisabled}
    >
      <Typography.Text>Credential preview</Typography.Text>
      <br />
      <br />
      <Form {...formItemLayout}>
        <Form.Item noStyle>
          <Row>
            <code>
              <pre>{JSON.stringify(claimToObject(fields), null, 2)}</pre>
            </code>
          </Row>
        </Form.Item>
        <Form.Item noStyle>
          <Input
            value={subject}
            placeholder="subject DID"
            style={{ width: '60%', marginBottom: 15 }}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Input
            value={issuer}
            placeholder="issuer DID"
            style={{ width: '60%', marginBottom: 15 }}
            onChange={(e) => setIssuer(e.target.value)}
          />
        </Form.Item>

        <Form.Item noStyle>
          <Input
            value={credentialType}
            placeholder="credential type e.g Profile"
            style={{ width: '60%', marginBottom: 15 }}
            onChange={(e) => setCredentialType(e.target.value)}
          />
        </Form.Item>

        <Form.Item style={{ backgroundColor: '#eaeaea', padding: 15 }}>
          <Form.Item noStyle>
            <Input
              placeholder="claim type e.g. 'name'"
              value={claimType}
              style={{ width: '60%', marginBottom: 15 }}
              onChange={(e) => setClaimType(e.target.value)}
            />
          </Form.Item>
          <Form.Item noStyle>
            <Input
              placeholder="claim value e.g. Alice"
              value={claimValue}
              style={{ width: '60%', marginBottom: 15 }}
              onChange={(e) => setClaimValue(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                updateClaimFields({
                  type: claimType,
                  value: claimValue,
                })
              }}
            >
              Add
            </Button>
          </Form.Item>

          <Typography.Text>{errorMessage}</Typography.Text>
        </Form.Item>

        <Form.Item>
          <Row>
            <Button
              type="primary"
              onClick={() => signVc()}
              style={{ marginRight: 5 }}
              disabled={sending || fields.length === 0 || !subject || !issuer}
            >
              Issue
            </Button>
            <Form.Item>
              <Button
                onClick={() => signVc(true)}
                type="primary"
                disabled={sending || fields.length === 0 || !subject || !issuer}
              >
                Issue & Send
              </Button>
            </Form.Item>
          </Row>
        </Form.Item>
      </Form>
    </DynamicModule>
  )
}

export default IssueCredential
