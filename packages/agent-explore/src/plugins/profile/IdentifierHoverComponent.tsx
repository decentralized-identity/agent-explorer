/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { IIdentifierHoverComponentProps } from "@veramo-community/agent-explorer-plugin";
import { IDataStoreORM } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { useQuery } from 'react-query';
import { Avatar, Space, Spin, Typography } from 'antd';
import { GithubOutlined, MailOutlined, TwitterOutlined } from '@ant-design/icons';

type IProfileInfo = {
  name?: string
  bio?: string
  email?: string
  picture?: string
  twitter?: string
  github?: string
}

export const IdentifierHoverComponent: React.FC<IIdentifierHoverComponentProps> = ({did}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  const [ profile, setProfile ] = useState<IProfileInfo>({})
  
  const { data: profileCredentials } = useQuery(
    [
      'identifierPrileCredentials',
      did,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials(
        {
          where: [
            { column: 'type', value: ['VerifiableCredential,Profile'] },
            { column: 'subject', value: [did] },
          ],
          order: [{ column: 'issuanceDate', direction: 'ASC' }],
        },
      )
  )

  useEffect(() => {
    if (profileCredentials && profileCredentials.length > 0) {
      const currentProfile = profile
      for (const credential of profileCredentials) {
        const { name, bio, email, picture, twitter, github } 
          = credential.verifiableCredential.credentialSubject
        if (name) currentProfile.name = name
        if (bio) currentProfile.bio = bio
        if (email) currentProfile.email = email
        if (picture) currentProfile.picture = picture
        if (twitter) currentProfile.twitter = twitter
        if (github) currentProfile.github = github
      }

      setProfile(currentProfile)
    }
  }, [profileCredentials])

  return (
    <Space direction='vertical'>
      <Space direction='horizontal'>
        {profile.picture && <Avatar src={profile.picture} size='large'/>}
        <Space direction='vertical'  style={{maxWidth: 300}}>
          {profile.name && <Typography.Text strong>{profile.name}</Typography.Text>}
          {profile.bio && <Typography.Text>{profile.bio}</Typography.Text>}
        </Space>
      </Space>
      {profile.email && <Typography.Text><MailOutlined /> {profile.email}</Typography.Text>}
      {profile.twitter && <Typography.Text><TwitterOutlined /> {profile.twitter}</Typography.Text>}
      {profile.github && <Typography.Text><GithubOutlined /> {profile.github}</Typography.Text>}
    </Space>
  )
}


