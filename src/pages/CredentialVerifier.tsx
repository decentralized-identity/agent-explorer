import React, { useState } from 'react'

import { useVeramo } from '@veramo-community/veramo-react'
import '@veramo-community/react-components/dist/cjs/index.css'
import { PageContainer } from '@ant-design/pro-components'
import CredentialTabs from '../components/standard/CredentialTabs'
import { ICredentialPlugin, IVerifyResult } from '@veramo/core'
import { Alert, Button, Input, Space } from 'antd'

const { TextArea } = Input

const CredentialVerifier = () => {
  const { agent } = useVeramo<ICredentialPlugin>()
  const [verificationResult, setVerificationResult] = useState<
    IVerifyResult | undefined
  >(undefined)
  const [text, setText] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)

  const verify = async () => {
    setIsVerifying(true)
    setVerificationResult(undefined)
    const result = await agent?.verifyCredential({
      credential: JSON.parse(text),
    })
    setVerificationResult(result)
    setIsVerifying(false)
  }

  return (
    <PageContainer title="Credential Verifier">
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          rows={4}
          placeholder="Paste in a Verifiable Credential"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="primary" onClick={verify}>
          Verify
        </Button>
        {isVerifying && <Alert message={'Verifying'} type="info" showIcon />}
        {verificationResult?.error && (
          <Alert
            message={verificationResult.error.message}
            type="error"
            showIcon
          />
        )}

        {verificationResult?.verified && (
          <Alert message={'Credential valid'} type="success" showIcon />
        )}

        {verificationResult?.verified &&
          verificationResult?.verifiableCredential && (
            <CredentialTabs
              credential={verificationResult?.verifiableCredential}
            />
          )}
      </Space>
    </PageContainer>
  )
}

export default CredentialVerifier
