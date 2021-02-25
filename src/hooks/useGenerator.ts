import { useState } from 'react'

export function useGenerator() {
  const [identifierProvider, setIdentifierProvider] = useState<string>('')
  const [identifierCount, setIdentifierCount] = useState<number>(50)
  const [identifiersGenerating, setIdentifiersGenerating] = useState<boolean>(
    false,
  )
  const [
    credentialProfilesGenerating,
    setCredentialProfilesGenerating,
  ] = useState<boolean>(false)

  const [
    credentialIssueFromCount,
    setCredentialIssueFromCount,
  ] = useState<number>(1)

  const [credentialIssueToCount, setCredentialIssueToCount] = useState<number>(
    1,
  )

  const [
    credentialsP2PGenerating,
    setCredentialsP2PGenerating,
  ] = useState<boolean>(false)

  return {
    identifierProvider,
    identifierCount,
    identifiersGenerating,
    credentialProfilesGenerating,
    credentialIssueFromCount,
    credentialIssueToCount,
    credentialsP2PGenerating,
    setCredentialsP2PGenerating,
    setCredentialIssueToCount,
    setCredentialIssueFromCount,
    setCredentialProfilesGenerating,
    setIdentifierProvider,
    setIdentifierCount,
    setIdentifiersGenerating,
  }
}
