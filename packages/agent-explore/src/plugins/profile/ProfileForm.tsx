import React from 'react'
import { App, Col, Form, Input, Row, Upload } from 'antd'
import { GithubOutlined, LoadingOutlined, MailOutlined, PlusOutlined, TwitterOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface';
import { ActionButton } from '@veramo-community/agent-explorer-plugin';
import { ICredentialIssuer, TAgent } from '@veramo/core-types';

export interface ProfileFormValues {
  name?: string
  email?: string
  bio?: string
  github?: string
  twitter?: string
  picture?: string
}

interface ProfileFormProps {
  onProfileSubmit: (did: string, agent: TAgent<ICredentialIssuer>, values: ProfileFormValues) => void
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};


export const ProfileForm: React.FC<ProfileFormProps> = ({
  onProfileSubmit,
}) => {
  const { notification } = App.useApp()
  const [form] = Form.useForm()

  const [loading, setLoading] = React.useState(false);
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

  const handleOk = (did: string, agent: TAgent<ICredentialIssuer>) => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onProfileSubmit(did, agent, values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
      <Form
        form={form}
        layout="vertical"
        name="form_in_form"
        initialValues={{
        }}
      >
        <Row justify={'center'}>
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
        </Row>

        <Form.Item name="picture" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" required={false}>
          <Input />
        </Form.Item>
        <Form.Item name="bio" label="Bio">
          <Input.TextArea rows={2}/>
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input prefix={<MailOutlined className="site-form-item-icon" />}/>
        </Form.Item>
        <Form.Item name="twitter" label="Twitter">
          <Input prefix={<TwitterOutlined className="site-form-item-icon" />}/>
        </Form.Item>
        <Form.Item name="github" label="Github">
          <Input prefix={<GithubOutlined className="site-form-item-icon" />}/>
        </Form.Item>
        <ActionButton title='Save to:' onAction={(did, agent) => handleOk(did, agent)} />

      </Form>

  )
}
