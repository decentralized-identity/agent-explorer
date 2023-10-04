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
  
  const { data: profileCredentials, isLoading } = useQuery(
    [
      'identifierProfileCredentials',
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

  const profile = React.useMemo<IProfileInfo>(() => {
    const profile: IProfileInfo = {}
    if (profileCredentials && profileCredentials.length > 0) {
      for (const credential of profileCredentials) {
        const { name, bio, email, picture, twitter, github } 
          = credential.verifiableCredential.credentialSubject
        if (name) profile.name = name
        if (bio) profile.bio = bio
        if (email) profile.email = email
        if (picture) profile.picture = picture
        if (twitter) profile.twitter = twitter
        if (github) profile.github = github
      }
    }
    return profile
  }, [profileCredentials])


  if (isLoading) return <Spin />

  return (
    <Space direction='vertical'>
      <Space direction='horizontal'>
        {isLoading && <Spin />}
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


