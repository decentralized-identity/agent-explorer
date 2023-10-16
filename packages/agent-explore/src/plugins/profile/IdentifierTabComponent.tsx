import React, { useState } from 'react';
import { IIdentifierHoverComponentProps, usePlugins } from "@veramo-community/agent-explorer-plugin";
import { ICredentialIssuer, IDataStoreORM, TAgent } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { Button, Space } from 'antd';
import { ProfileForm } from './ProfileForm';
import { useQueryClient } from 'react-query'
type IProfileInfo = {
  name?: string
  bio?: string
  email?: string
  picture?: string
  twitter?: string
  github?: string
}

export const IdentifierTabComponent: React.FC<IIdentifierHoverComponentProps> = ({did}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  const { plugins } = usePlugins()
  const [ showForm, setShowForm ] = useState(false)
  const queryClient = useQueryClient()

  

  const hoverComponents = React.useMemo(() => {
    const components: React.FC<IIdentifierHoverComponentProps>[] = []
    plugins.forEach((plugin) => {
      if (plugin.config?.enabled && plugin.getIdentifierHoverComponent) {
        const Component = plugin.getIdentifierHoverComponent()
        if (Component) {
          components.push(Component)
        }
      }
    })
    return components
  }, [plugins])

  const handleProfileSubmit = async (issuer: string, issuerAgent: TAgent<ICredentialIssuer>,  values: IProfileInfo) => {
    if (values.name || values.email || values.bio || values.github || values.twitter || values.picture) {
      const credentialSubject: any = {
        id: did,
      }
      if (values.name) credentialSubject['name'] = values.name
      if (values.email) credentialSubject['email'] = values.email
      if (values.bio) credentialSubject['bio'] = values.bio
      if (values.github) credentialSubject['github'] = values.github
      if (values.twitter) credentialSubject['twitter'] = values.twitter
      if (values.picture) credentialSubject['picture'] = values.picture
      const credential = await issuerAgent.createVerifiableCredential({
        credential: {
          issuer: { id: issuer },
          issuanceDate: new Date().toISOString(),
          type: ['VerifiableCredential', 'Profile'],
          credentialSubject,
        },
        proofFormat: 'jwt',
      })
      if (credential) {
        await agent?.dataStoreSaveVerifiableCredential({
          verifiableCredential: credential,
        })
        queryClient.invalidateQueries({ 
          queryKey: [
            'identifierProfileCredentials', 
            {did, agentId: agent?.context.id}
          ] 
        })
        queryClient.invalidateQueries({ 
          queryKey: [
            'identifierProfile', 
            {did, agentId: agent?.context.id}
          ] 
        })
      }

    }
    setShowForm(false)
  }

  return (
    <>
      {!showForm && <Space direction='vertical'>
        {!showForm && hoverComponents.map((Component, index) => (
          React.createElement(Component, { key: index, did: did })
          ))}
      <Button 
        type='text' 
        onClick={() => setShowForm(true)}
        style={{position: 'absolute', top: 0, right: 0}}
        >Edit</Button>
      </Space>}
      {showForm && <ProfileForm onProfileSubmit={handleProfileSubmit}/>}
    </>
  )
}


