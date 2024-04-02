import * as React from "react";
import { ICredentialVerifier, IDataStore, IVerifyResult, UniqueVerifiableCredential, VerifiableCredential as VCred, VerifiableCredential} from "@veramo/core";

import { useVeramo } from "@veramo-community/veramo-react";
import { getIssuerDID, shortId } from "../utils/did.js";
import { formatRelative } from "date-fns";
import { usePlugins } from "../PluginProvider.js";
import { ICredentialActionComponentProps, IVerifiableComponentProps } from "../types.js";
import { IdentifierProfile } from "./IdentifierProfile.js";
import { useQuery } from "react-query";
import { Avatar, Button, Col, Divider, Popover, Row, Skeleton, Space, Spin, Tag, Typography, theme } from "antd";
import { CredentialActionsDropdown } from "./CredentialActionsDropdown.js";
import { EllipsisOutlined } from "@ant-design/icons";
import { IdentifierPopover } from "./IdentifierPopover.js";

export const VerifiableCredentialComponent = (
  { credential, verify = true, context } : { 
    credential: UniqueVerifiableCredential,
    verify?: boolean
    context?: any
}
) => {
  const { agent } = useVeramo<ICredentialVerifier & IDataStore>()
  const { token } = theme.useToken()

  const { plugins } = usePlugins()
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false)
  const [verifyResult, setVerifyResult] = React.useState<IVerifyResult | undefined>(undefined)


  const actionComponents = React.useMemo(() => {
    let actionComponents: React.FC<ICredentialActionComponentProps>[] = []
    plugins.forEach((plugin) => {
      if (plugin.config?.enabled && plugin.getCredentialActionComponents) {
        const components = plugin.getCredentialActionComponents()
        if (components) {
          actionComponents.push(...components)
        }
      }
    })
    return actionComponents
  }, [plugins])

  console.log({actionComponents})

  
  const headerComponents = React.useMemo(() => {
    let headerComponents: React.FC<IVerifiableComponentProps>[] = []
    plugins.forEach((plugin) => {
      if (plugin.config?.enabled && plugin.getCredentialHeaderComponent) {
        const components = plugin.getCredentialHeaderComponent(credential)
        if (components) {
          headerComponents.push(components)
        }
      }
    })
    return headerComponents
  }, [plugins])

  console.log({headerComponents})

  console.log("verifiableCredentail: ", credential)

  React.useEffect(() => {
    if (verify && !verifyResult && !isVerifying) {
      setIsVerifying(true)
      // wait for 2 seconds before verifying
      setTimeout(() => {
        agent?.verifyCredential({ 
          credential: credential.verifiableCredential, 
          fetchRemoteContexts: true
        }).then((result) => {
          setVerifyResult(result)
        }).catch((error) => {
          console.log(error)
          setVerifyResult({
            error: {
              message: error.message
            },
            verified: false
          })
        }).finally(() => {
          setIsVerifying(false)
        })
      }, 2000)
    }
  },[verify, verifyResult, isVerifying])

  const did = getIssuerDID(credential.verifiableCredential)

  const { data: profile, isLoading: isLoadingProfile } = useQuery(
    ['identifierProfile', did, agent?.context.id],
    () => (did ? agent?.getIdentifierProfile({ did }) : undefined),
  )

  let Component: React.FC<IVerifiableComponentProps> | undefined = undefined
  plugins.forEach((plugin) => {
    if (Component === undefined && plugin.getCredentialComponent) {
      const Obj = plugin.getCredentialComponent(credential)
      if (Obj) {
        Component = Obj
      }
    }
  })

  if (Component === undefined) {
    Component = Generic
  }

  let color = !isVerifying && verifyResult?.error ? token.colorError : token.colorSuccess
  color = isVerifying ? token.colorBorder : color

  return (<>
    <div style={{
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0px 0px 2px ' + token.colorBorder,
      borderLeft: '2px solid ' + color,
      backgroundColor: token.colorBgElevated,
      overflow: 'hidden'
    }}>

    {credential && <div>
      
      
      <Row align="top" 
        wrap={false} 
        style={{
          // width: '100%',
          position: 'relative'
        }}
        justify={'space-between'}
      >
      <Col 
        >
        <div style={{ justifyItems: 'flex-start', display: 'flex' }}>
          <Space direction='horizontal' wrap={true}>
            <div>
              {!isLoadingProfile && <Avatar src={profile?.picture} size={'small'} />}
              {isLoadingProfile && <Skeleton.Avatar active />}
            </div>
            <IdentifierPopover did={did}>
              <Typography.Text ellipsis>
                {isLoadingProfile ? shortId(did):  profile?.name} 
              </Typography.Text>
            </IdentifierPopover>

            <Typography.Text type='secondary'>{formatRelative(
              new Date(credential.verifiableCredential.issuanceDate),
              new Date()
              )}</Typography.Text>
              {isVerifying && <Spin size="small"/>}

            {verifyResult?.error && <Tag color="error">{verifyResult.error.message}</Tag>}
            {headerComponents.length > 0 && <>
                {headerComponents.map((Component, index) => (
                  React.createElement(Component, { credential })
                ))}
            </>}
          </Space>
          {isLoadingProfile && <Skeleton.Input style={{ width: 100 }} active />}
        </div>
        
      </Col>
      <Col xs={1} style={{marginRight: token.padding}}>
        <CredentialActionsDropdown uniqueCredential={credential}>
          
          <Button type="text" size="small"><EllipsisOutlined /></Button>
        </CredentialActionsDropdown>
      </Col>

    </Row>
      </div>}

      {credential && <Component credential={credential} context={context}/>}
      {actionComponents.length > 0 && <>
        <Space direction="horizontal" style={{width: '100%', marginTop: token.marginXS}}>
          {actionComponents.map((Component, index) => (
            React.createElement(Component, { key: index, hash: credential.hash })
          ))}
        </Space>
      </>}
    </div>
    </>
  )

};

export const Generic: React.FC<IVerifiableComponentProps> = ({ credential }) => {
  return <div>
      <dl>
      <dt style={{fontWeight: 'bold'}}>Type</dt>
      <dd>{(credential.verifiableCredential.type as string[]).map((type: string, index: number) => <Tag key={index}>{type}</Tag>)}</dd>
      {Object.entries(credential.verifiableCredential.credentialSubject)
        .map(([key, value]: [string, any]): React.ReactNode => 
        <div key={key}>
          <dt style={{fontWeight: 'bold'}}>{key}</dt>
          <dd>
            {typeof value === 'object' || Array.isArray(value) ? JSON.stringify(value) : (
              key === 'id' ? shortId(value) : value
            )}
          </dd>
        </div>
      )}
      </dl>
  </div>;
};
