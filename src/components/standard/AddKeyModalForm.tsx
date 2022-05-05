import React from 'react'
import { Modal, Form, Input } from 'antd'

export interface AddKeyModalValues {
  kid: string
  kms: string
  type: string
  publicKeyHex: string
  privateKeyHex?: string
}

interface AddKeyModalFormProps {
  visible: boolean
  onAdd: (values: AddKeyModalValues) => void
  onCancel: () => void
}

const AddKeyModalForm: React.FC<AddKeyModalFormProps> = ({
  visible,
  onAdd,
  onCancel,
}) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={visible}
      title="Add Public Key to DID"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onAdd(values)
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
          name="kid"
          label="Key ID"
          rules={[
            { required: true, message: 'Please input the ID of the key!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="kms"
          label="Key Management System"
          rules={[
            { required: true, message: 'Please input the KMS of the key!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="publicKeyHex"
          label="Public Key Hex"
          rules={[
            {
              required: true,
              message: 'Please input the Public Key Hex of the key!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="privateKeyHex" label="Private Key Hex (optional)">
          <Input />
        </Form.Item>
        {/* TODO: Add key metadata */}
      </Form>
    </Modal>
  )
}

export default AddKeyModalForm
