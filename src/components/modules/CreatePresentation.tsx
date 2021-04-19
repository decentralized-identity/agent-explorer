import React, { useState } from 'react'
import {
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Card,
  Table,
  Tag,
} from 'antd'
import DynamicModule from '../../layout/PageModule'
import { PageModuleProps } from '../../types'
import { signVerifiablePresentation } from '../../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { useParams, useHistory } from 'react-router-dom'

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

interface DataType {
  hash: string
  verifiableCredential: any
}

interface BarChartProps extends PageModuleProps {}

const historyColumns = [
  {
    title: 'Issuance Date',
    dataIndex: 'verifiableCredential',
    sorter: {
      compare: (a: any, b: any) =>
        new Date(a.verifiableCredential.issuanceDate).getTime() -
        new Date(b.verifiableCredential.issuanceDate).getTime(),
      multiple: 1,
    },
    render: (verifiableCredential: any) =>
      format(new Date(verifiableCredential.issuanceDate), 'PPP'),
  },
  {
    title: 'Type',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      verifiableCredential.type.map((type: string, i: number) => (
        <Tag color="geekblue" key={i}>
          {type}
        </Tag>
      )),
  },
]

const CreatePresentation: React.FC<BarChartProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
}) => {
  const { agent } = useVeramo()
  const [selectedCredentials, setSelectedCredentials] = useState<any[]>([])
  const [sending, setSending] = useState<boolean>(false)
  const [issuer, setIssuer] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [proofFormat, setProofFormat] = useState('jwt')
  const { data: credentials, isLoading: credentialHistoryLoading } = useQuery(
    ['credentials'],
    () => agent?.dataStoreORMGetVerifiableCredentials(),
  )
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedCredentials(
        selectedRows.map((row) => row.verifiableCredential),
      )
    },
  }

  const signVP = async (send?: boolean) => {
    const vp = await signVerifiablePresentation(
      agent,
      issuer,
      [subject],
      selectedCredentials,
      proofFormat,
    )

    setIssuer('')
    setSubject('')
    setSelectedCredentials([])

    if (send) {
      await sendVP(vp)
    }
  }

  const sendVP = async (body: any) => {
    try {
      await agent?.sendMessageDIDCommAlpha1({
        data: {
          to: subject as string,
          from: issuer as string,
          type: proofFormat,
          body: proofFormat === 'jwt' ? body.proof.jwt : body,
        },
        save: true,
      })
    } catch (err) {
      console.log(err)
      agent?.handleMessage({ raw: body.proof.jwt, save: true })
    }
  }

  return (
    <DynamicModule
      noPadding
      title={title}
      isLoading={isLoading}
      remove={remove}
      removeDisabled={removeDisabled}
    >
      <Card bordered={false}>
        <Typography.Text>
          Select credentials to create presentation
        </Typography.Text>
        <br />
        <br />
        <Form.Item noStyle>
          <Input
            value={subject}
            placeholder="verifier DID"
            style={{ width: '60%', marginBottom: 15 }}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Input
            value={issuer}
            placeholder="holder DID"
            style={{ width: '60%', marginBottom: 15 }}
            onChange={(e) => setIssuer(e.target.value)}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Input
            value={proofFormat}
            placeholder="jwt or lds"
            style={{ width: '60%', marginBottom: 15 }}
            onChange={(e) => setProofFormat(e.target.value)}
          />
        </Form.Item>
        <Row>
          <Button
            type="primary"
            onClick={() => signVP()}
            style={{ marginRight: 5 }}
            disabled={
              sending || selectedCredentials.length === 0 || !subject || !issuer
            }
          >
            Create Presentation
          </Button>
          <Button
            onClick={() => signVP(true)}
            type="primary"
            disabled={
              sending || selectedCredentials.length === 0 || !subject || !issuer
            }
          >
            Create Presentation & Send
          </Button>
        </Row>
      </Card>
      <Form {...formItemLayout}>
        <Form.Item noStyle>
          <div>
            <Table
              loading={credentialHistoryLoading}
              rowSelection={rowSelection}
              expandable={{
                expandedRowRender: (record) => (
                  <pre>
                    {JSON.stringify(
                      record.verifiableCredential.credentialSubject,
                      null,
                      2,
                    )}
                  </pre>
                ),
              }}
              rowKey={(record) => record.hash}
              columns={historyColumns}
              dataSource={credentials}
              pagination={false}
            />
          </div>
        </Form.Item>
      </Form>
    </DynamicModule>
  )
}

export default CreatePresentation
