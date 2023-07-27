import React from 'react'
import { Modal, Form, Input } from 'antd'
// import { IDIDManager } from '@veramo/core-types'
// import { useQuery } from 'react-query'
// import { useVeramo } from '@veramo-community/veramo-react'
// import IdentifierProfile from '../../components/IdentifierProfile'
// const { Option } = Select

export interface NewOperatorModalValues {
  ckey: string
  // id: string
  mediator: string
}

interface NewOperatorModalFormProps {
  visible: boolean
  onOk: (values: NewOperatorModalValues) => void
  onCancel: () => void
}

const NewGameModalForm: React.FC<NewOperatorModalFormProps> = ({
  visible,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()
  // const { agent } = useVeramo<IDIDManager>()  
  // const {
  //   data: identifiers,
  // } = useQuery(['identifiers', { agentId: agent?.context.id }], () =>
  //   agent?.didManagerFind(),
  // )


  return (
    <Modal
      open={visible}
      title="Create new Operator"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onOk(values)
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
        initialValues={{
          mediator: 'did:web:dev-didcomm-mediator.herokuapp.com'
        }}
      >
        {/* <Form.Item
          name="id"
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
        </Form.Item> */}
        
        <Form.Item name="ckey" label="CKey">
          <Input />
        </Form.Item>
        <Form.Item name="mediator" label="Mediator">
          <Input placeholder='did:web:dev-didcomm-mediator.herokuapp.com'/>
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default NewGameModalForm
