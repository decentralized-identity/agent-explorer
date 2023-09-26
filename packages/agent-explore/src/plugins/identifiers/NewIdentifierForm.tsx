import React from 'react'
import { App, Button, Col, Form, Input, Row, Select, Space, Steps, Upload } from 'antd'
import { GithubOutlined, LoadingOutlined, MailOutlined, PlusOutlined, TwitterOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface';

const { Option } = Select

export interface NewIdentifierFormValues {
  provider: string
  alias: string
  mediator?: string
  name?: string
  email?: string
  bio?: string
  github?: string
  twitter?: string
  picture?: string
}

interface NewIdentifierFormFormProps {
  onNewIdentifier: (values: NewIdentifierFormValues) => void
  providers: string[]
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};


export const NewIdentifierForm: React.FC<NewIdentifierFormFormProps> = ({
  onNewIdentifier,
  providers,
}) => {
  const { notification } = App.useApp()
  const [step, setStep] = React.useState(0)
  const [form] = Form.useForm()

  const [loading, setLoading] = React.useState(false);
  const provider = Form.useWatch('provider', form);
  const picture = Form.useWatch('picture', {form, preserve:true});

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({ message: 'You can only upload JPG/PNG file!'});
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({ message: 'Image must smaller than 2MB!'});
    }

    getBase64(file as RcFile, (url) => {
      setLoading(false);
      form.setFieldValue('picture', url);
    });

    return false
  };
  
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Picture</div>
    </div>
  );

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        setStep(0)
        console.log({values})
        onNewIdentifier(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleNext = () => {
    form
      .validateFields()
      .then(() => {
        setStep(step + 1)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Space direction='vertical' style={{width: '100%'}}>
      <Steps
        size="small"
        current={step}
        items={[
          {
            title: 'Identifier',
          },
          {
            title: 'Profile information',
          },
        ]}
      />
      <Form
        form={form}
        layout="vertical"
        name="form_in_form"
        initialValues={{
          provider: providers?.[0],
          mediator: 'did:web:dev-didcomm-mediator.herokuapp.com',
        }}
      >

          <Form.Item name="alias" label="Alias" hidden={step === 1}>
            <Input />
          </Form.Item>
          <Form.Item
            name="provider"
            label="Identifier Provider"
            hidden={step === 1}
            rules={[
              { required: true, message: 'Please select Idenifier Provider!' },
            ]}
          >
            <Select
              onChange={(value) => form.setFieldsValue({ provider: value })}
            >
              {providers?.map((provider) => {
                return (
                  <Option value={provider} key={provider}>
                    {provider}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          {provider === 'did:peer' && <Form.Item name="mediator" label="Mediator" hidden={step === 1}>
            <Input />
          </Form.Item>}
          

          {step === 1 && <Row justify={'center'}>
            <Col >

              <Upload
                name="avatar"
                listType="picture-circle"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={() => {console.log('changed')}}
                >
                {picture ? <img src={picture} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Col>
          </Row>}

          <Form.Item name="picture" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" required={false} hidden={step === 0}>
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio" hidden={step === 0}>
            <Input.TextArea rows={2}/>
          </Form.Item>
          <Form.Item name="email" label="Email" hidden={step === 0}>
            <Input prefix={<MailOutlined className="site-form-item-icon" />}/>
          </Form.Item>
          <Form.Item name="twitter" label="Twitter" hidden={step === 0}>
            <Input prefix={<TwitterOutlined className="site-form-item-icon" />}/>
          </Form.Item>
          <Form.Item name="github" label="Github" hidden={step === 0}>
            <Input prefix={<GithubOutlined className="site-form-item-icon" />}/>
          </Form.Item>
          {step === 0 && <Button onClick={handleNext} type='primary'>Next</Button>}

          {step === 1 && 
          <Space>
            <Button onClick={() => setStep(0)} >Back</Button>
            <Button onClick={handleOk} type='primary'>Finish</Button>
          </Space>}

      </Form>
      </Space>

  )
}
