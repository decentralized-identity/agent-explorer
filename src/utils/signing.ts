import { W3CVerifiableCredential, ProofFormat } from '@veramo/core'

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
  credentialSchemaId?: string,
) => {
  let credentialObj: any = {
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
  }

  // adding undefined field was breaking EIP-712 Issuance, so just don't add field at all if undefined
  if (credentialSchemaId) {
    credentialObj = {
      ...credentialObj,
      credentialSchema: {
        id: credentialSchemaId,
        type: 'JsonSchemaValidator2018',
      },
    }
  }
  return await agent?.createVerifiableCredential(credentialObj)
}

const signVerifiablePresentation = async (
  agent: any,
  did: string,
  verifier: string[],
  selected: W3CVerifiableCredential[],
  proofFormat: ProofFormat,
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

export { claimToObject, issueCredential, signVerifiablePresentation }
