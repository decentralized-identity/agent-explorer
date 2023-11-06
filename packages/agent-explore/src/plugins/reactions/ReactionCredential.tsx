import * as React from "react";
import { UniqueVerifiableCredential } from "@veramo/core";
import { Space, Typography, theme } from "antd";

export const ReactionCredential: React.FC<{credential: UniqueVerifiableCredential}> = ({ credential: { verifiableCredential } }) => {
  const { token } = theme.useToken()
  const { emoji } = verifiableCredential.credentialSubject
  return (
    <Space direction='vertical' style={{marginTop: token.margin}}>
      <Typography.Title>{emoji}</Typography.Title>
    </Space>
  )
}
