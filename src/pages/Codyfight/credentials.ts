import { ICredentialIssuer, TAgent } from "@veramo/core-types"

type Operator = {
  id: string
  ckey: string
}

export const createOperatorCredential = async (agent: TAgent<ICredentialIssuer>, operator: Operator) => {
  return await agent.createVerifiableCredential({
    credential: {
      type: ['VerifiableCredential', 'Codyfight', 'Operator'],
      issuer: { id: operator.id },
      issuanceDate: new Date().toISOString(),
      credentialSubject: operator,
    },
    proofFormat: 'jwt',
  })
}

type Profile = {
  id: string
  name: string
  picture: string
}

export const createProfileCredential = async (agent: TAgent<ICredentialIssuer>, profile: Profile) => {
  return await agent.createVerifiableCredential({
    credential: {
      type: ['VerifiableCredential', 'Profile'],
      issuer: { id: profile.id },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: profile.id,
        name: profile.name,
        picture: profile.picture,
      },
    },
    proofFormat: 'jwt',
  })
}