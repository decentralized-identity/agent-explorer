import * as React from "react";
import { UniqueVerifiableCredential } from "@veramo/core";
import { Avatar, Space, Typography, theme } from "antd";
import { MailOutlined, TwitterOutlined, GithubOutlined } from "@ant-design/icons";

export const Profile: React.FC<{credential: UniqueVerifiableCredential}> = ({ credential: { verifiableCredential } }) => {
  const { token } = theme.useToken()
  const { name, bio, email, picture, twitter, github } = verifiableCredential.credentialSubject
  return (
    <Space direction='vertical' style={{marginTop: token.margin}}>
      <Space direction='horizontal' align="start">
        {picture && <Avatar src={picture} size='large'/>}
        <Space direction='vertical'  style={{maxWidth: 300}}>
          {name && <Typography.Text strong>{name}</Typography.Text>}
          {bio && <Typography.Text>{bio}</Typography.Text>}
          {email && <Typography.Text><MailOutlined /> {email}</Typography.Text>}
          {twitter && <Typography.Text><TwitterOutlined /> {twitter}</Typography.Text>}
          {github && <Typography.Text><GithubOutlined /> {github}</Typography.Text>}
        </Space>
      </Space>
    </Space>
  )
}
