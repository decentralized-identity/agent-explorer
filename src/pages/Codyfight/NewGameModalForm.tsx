import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
const { Option } = Select

export interface NewGameModalValues {
  mode: 0 | 1 | 2 | 3
  opponent?: string
}

interface NewGameModalFormProps {
  visible: boolean
  onNewGame: (values: NewGameModalValues) => void
  onCancel: () => void
}

const NewGameModalForm: React.FC<NewGameModalFormProps> = ({
  visible,
  onNewGame,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const modeValue = Form.useWatch('mode', form);

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

        {modeValue === 1 && <Form.Item name="opponent" label="Opponent">
          <Input />
        </Form.Item>}


      </Form>
    </Modal>
  )
}

export default NewGameModalForm
