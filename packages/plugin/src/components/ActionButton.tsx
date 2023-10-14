import { Dropdown, Avatar } from 'antd'
import React, { useState, useEffect } from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { ICredentialIssuer, IDIDManager, IDataStore, IDataStoreORM, IIdentifier, TAgent } from '@veramo/core'
import { useQuery } from 'react-query'
import { IIdentifierProfile } from '../agent-plugins/IdentifierProfilePlugin.js'
import { IdentifierProfile } from './IdentifierProfile.js'


interface ActionButtonProps {
  onAction: (did: string, agent?: TAgent<any>) => void
  title: string
  disabled?: boolean
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onAction, title, disabled }) => {
  const { agent } = useVeramo<ICredentialIssuer & IDataStore & IDataStoreORM & IDIDManager>()
  const [selectedDid, setSelectedDid] = useState('')
  const [issuerProfile, setIssuerProfile] = useState<IIdentifierProfile>()
  const [managedIdentifiers, setManagedIdentifiers] = useState<
    IIdentifier[]
  >([])
  const [
    managedIdentifiersWithProfiles,
    setManagedIdentifiersWithProfiles,
  ] = useState<IIdentifierProfile[]>([])


  useQuery(
    ['identifiers', { id: agent?.context.id }],
    () => agent?.didManagerFind(),
    {
      onSuccess: (data: IIdentifier[]) => {
        if (data) {
          setManagedIdentifiers(data)
          setSelectedDid(data[0].did)
        }
      },
    },
  )

  useEffect(() => {
    if (agent) {
      Promise.all(
        managedIdentifiers.map((identifier) => {
          return agent.getIdentifierProfile({ did: identifier.did })
        }),
      )
        .then((profiles) => {
          setIssuerProfile(profiles[0])
          setManagedIdentifiersWithProfiles(profiles)
        })
        .catch(console.log)
    }
  }, [managedIdentifiers, agent])

  if (managedIdentifiersWithProfiles.length === 0) return null
  return (
      <Dropdown.Button
        disabled={disabled}
        type='primary'
        onClick={() => onAction(selectedDid, agent)}
        icon={<Avatar size={'small'} src={issuerProfile?.picture} />}
        menu={{
          items: [
            ...managedIdentifiersWithProfiles.map((profile) => {
              return {
                key: profile.did,
                onClick: () => {
                  setIssuerProfile(profile)
                  setSelectedDid(profile.did)
                },
                label: <IdentifierProfile did={profile.did} />,
              }
            }),
          ],
          selectable: true,
          defaultSelectedKeys: [selectedDid],
        }}
      >
        {title}
      </Dropdown.Button>
  )
}
