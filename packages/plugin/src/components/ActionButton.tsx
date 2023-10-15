import { Dropdown, Avatar, Row, Col, Typography, theme, Space, Divider, Button, Spin, Drawer, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { ICredentialIssuer, IDIDManager, IDataStore, IDataStoreORM, IIdentifier, TAgent } from '@veramo/core'
import { useQueries } from 'react-query'
import { IIdentifierProfile } from '../agent-plugins/IdentifierProfilePlugin.js'
import { shortId } from '../utils/did.js'
import { set } from 'date-fns'

interface ActionButtonProps {
  onAction: (did: string, agent: TAgent<ICredentialIssuer>) => void
  title: string
  disabled?: boolean
}

type IdentifierProfileWithAgent = 
  IIdentifierProfile & { 
    agent: TAgent<ICredentialIssuer & IDataStore & IDataStoreORM & IDIDManager> 
  }

type IdentifierWithAgent = IIdentifier & {
  agent: TAgent<ICredentialIssuer & IDataStore & IDataStoreORM & IDIDManager>
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onAction, title, disabled }) => {
  const { agents, agent } = useVeramo<ICredentialIssuer & IDataStore & IDataStoreORM & IDIDManager>()
  const [issuerProfile, setIssuerProfile] = useState<IdentifierProfileWithAgent>()
  const [showDrawer, setShowDrawer] = useState(false)

  const { token } = theme.useToken()


  const agentQueries = useQueries(
    agents.map(agent => {
      return {
        queryKey: ['identifiers', { agentId: agent?.context.id }],
        queryFn: () => agent.didManagerFind(),
      }
    })
  )

  const identifiersWithAgents: IdentifierWithAgent[] = React.useMemo(() => {
    const identifiersWithAgents: IdentifierWithAgent[] = []
    if (agentQueries.every(
      result => result.isSuccess || result.isError
    )) {
      agentQueries.forEach((agentQuery, agentIndex) => {
        if (agentQuery.isSuccess && agentQuery.data) {
          agentQuery.data.forEach((identifier) => {
            identifiersWithAgents.push({
              ...identifier,
              agent: agents[agentIndex],
            })
          })
        }

      })

    }      
    return identifiersWithAgents
  }, [agentQueries])


  const profileQueries = useQueries(
    identifiersWithAgents.map(identifier => {
      return {
        queryKey: ['identifierProfile', { 
            did: identifier.did, 
            //@ts-ignore
            agentId: identifier.agent.context.id
        }],
        queryFn: () => identifier.agent.getIdentifierProfile({ did: identifier.did })
      }
    })
  )

  const profilesWithAgents: IdentifierProfileWithAgent[] = React.useMemo(() => {
    const profilesWithAgents: IdentifierProfileWithAgent[] = []
    if (profileQueries.every(
      result => result.isSuccess || result.isError
    )) {

      
      profileQueries.forEach((profileQuery, profileIndex) => {
        if (profileQuery.isSuccess && profileQuery.data) {
          profilesWithAgents.push({
            ...profileQuery.data,
            agent: identifiersWithAgents[profileIndex].agent,
          })
        }
        
      })
    }

    return profilesWithAgents
  }, [profileQueries])

  const defaultProfile = React.useMemo(() => {
    if (issuerProfile) return issuerProfile
    if (profilesWithAgents.length === 0) return null
    return profilesWithAgents[0]
  }
  , [issuerProfile, profilesWithAgents])


  if (defaultProfile === null) return (<Spin />)

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  };

  return (
      <>
      <Button
        onClick={() => onAction(defaultProfile.did, defaultProfile.agent)}
        type='primary'
        disabled={disabled}
        >
        {title} {agent?.context.name}
      </Button>
      <Button
        onClick={() => setShowDrawer(true)}
        type='text'
        icon={<Avatar size={'small'} src={issuerProfile?.picture || defaultProfile.picture} />}
        >
      </Button>
      <Drawer
        title="Select issuer"
        placement="bottom"
        closable={true}
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        height={500}
      >
        <Row>
          <Col md={6}/>
          <Col  
            md={12}
            xs={24}
            style={{position: 'relative'}}
            >
            <Menu
              style={menuStyle}
              items = {profilesWithAgents.map((profile) => {
                return (
                  {
                    key: profile.did,
                    onClick: () => {
                      setIssuerProfile(profile)
                      setShowDrawer(false)
                    },
                    icon: <Avatar src={profile.picture} size={'small'}/>,
                    label: profile.name,
                  }
                )
              }
              )}
            />
          </Col>
          <Col md={6}/>
        </Row>

      </Drawer>
      </>
  )
}
