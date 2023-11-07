import * as React from "react";
import { IDataStore, IDataStoreORM, UniqueVerifiableCredential } from "@veramo/core";
import { Space, Spin, Typography, theme } from "antd";
import { useVeramo } from "@veramo-community/veramo-react";
import { VerifiableCredentialComponent } from "@veramo-community/agent-explorer-plugin";
import { useQuery } from "react-query";

export const ReactionCredential: React.FC<{
  credential: UniqueVerifiableCredential
}> = ({ credential: { verifiableCredential } }) => {
  const { agent } = useVeramo<IDataStoreORM & IDataStore>()
  const { token } = theme.useToken()
  const { emoji, id } = verifiableCredential.credentialSubject

  if (!id) return null

  const { data: referencedCredential, isLoading: credentialLoading, isError, error } = useQuery(
    ['credential', { id, agentId: agent?.context.id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id! }),
  )

  return (
    <Space direction='horizontal' style={{marginTop: token.margin}}>
      <Typography.Title>{emoji}</Typography.Title>
      {referencedCredential && <VerifiableCredentialComponent credential={{
        hash: id, 
        verifiableCredential: referencedCredential
      }} />}
      {credentialLoading && <Spin />}
      {isError && <Typography.Text type='danger'>{(error as any).message}</Typography.Text>}
    </Space>
  )
}
