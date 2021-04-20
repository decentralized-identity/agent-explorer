import { TAgent } from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'

const shortId = (did: string) => `${did.slice(0, 15)}...${did.slice(-4)}`

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}

const issueCredential = async (
  agent: any,
  iss: string | undefined,
  sub: string | undefined,
  claims: any[],
  proofFormat: string,
  customContext?: string,
  type?: string,
) => {
  return await agent?.createVerifiableCredential({
    credential: {
      issuer: { id: iss },
      issuanceDate: new Date().toISOString(),
      '@context': customContext
        ? ['https://www.w3.org/2018/credentials/v1', customContext]
        : ['https://www.w3.org/2018/credentials/v1'],
      type: type ? ['VerifiableCredential', type] : ['VerifiableCredential'],
      credentialSubject: { id: sub, ...claimToObject(claims) },
    },
    proofFormat,
    save: true,
  })
}

const signVerifiablePresentation = async (
  agent: any,
  did: string,
  verifier: string[],
  selected: any,
  proofFormat: string,
) => {
  return await agent?.createVerifiablePresentation({
    presentation: {
      holder: did,
      verifier,
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      verifiableCredential: selected,
    },
    proofFormat,
    save: true,
  })
}

export { claimToObject, shortId, issueCredential, signVerifiablePresentation }
