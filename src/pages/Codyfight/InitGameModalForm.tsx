import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { IDIDManager } from '@veramo/core-types'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierProfile from '../../components/IdentifierProfile'
const { Option } = Select

export interface NewGameModalValues {
  ckey: string
  mode: 0 | 1 | 2 | 3
  identifier: string
}

interface InitGameModalFormProps {
  visible: boolean
  onNewGame: (values: NewGameModalValues) => void
  onCancel: () => void
}

const NewGameModalForm: React.FC<InitGameModalFormProps> = ({
  visible,
  onNewGame,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const { agent } = useVeramo<IDIDManager>()
  
  const {
    data: identifiers,
  } = useQuery(['identifiers', { agentId: agent?.context.id }], () =>
    agent?.didManagerFind(),
  )

  const gameModes = [
    { mode: 0, name: 'Sandbox' },
    { mode: 1, name: 'Friendy dual' },
    { mode: 3, name: 'Llama\'s maze' },
  ]

  return (
    <Modal
      open={visible}
      title="Create new Identifier"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onNewGame(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{}}
      >
        <Form.Item name="ckey" label="CKey">
          <Input />
        </Form.Item>
        <Form.Item
          name="mode"
          label="Game Mode"
          rules={[
            { required: true, message: 'Please select Game mode!' },
          ]}
        >
          <Select
            placeholder="Mode"
            onChange={(value) => form.setFieldsValue({ mode: value })}
            allowClear
          >
            {gameModes?.map((item) => {
              return (
                <Option value={item.mode} key={item.mode}>
                  {item.name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="identifier"
          label="Managed Identifier"
          rules={[
            { required: true, message: 'Please select managed identifier!' },
          ]}
        >
          <Select
            placeholder="Identifier"
            onChange={(value) => form.setFieldsValue({ identifier: value })}
            allowClear
          >
            {identifiers?.map((item) => {
              return (
                <Option value={item.did} key={item.did}>
                  <IdentifierProfile did={item.did} />
                </Option>
              )
            })}
          </Select>
        </Form.Item>


      </Form>
    </Modal>
  )
}

export default NewGameModalForm
