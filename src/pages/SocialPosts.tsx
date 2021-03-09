import React from 'react'
import { Typography, Avatar, List } from 'antd'
import Page from '../layout/Page'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import PostButton from '../components/modules/PostButton'

const { Title } = Typography

const Credentials = () => {

  const { agent } = useVeramo()
  const { data: credentials } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentials({
      where: [
        { column: 'type', value: ['VerifiableCredential,VerifiableSocialPosting'] }
      ],
      order: [
        {column: 'issuanceDate', direction: 'DESC'}
      ]
    }),
  )

  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Social posts</Title>}>
      <PostButton />

      <List
        itemLayout="horizontal"
        dataSource={credentials}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.verifiableCredential.credentialSubject.author?.image} size='large'/>}
              title={<a href={'/credential/' + item.hash}>{item.verifiableCredential.credentialSubject.author?.name}</a>}
              description={item.verifiableCredential.credentialSubject?.headline + ' ' + item.verifiableCredential.credentialSubject?.articleBody}
            />
          </List.Item>
        )}
      />
    </Page>
  )
}

export default Credentials
