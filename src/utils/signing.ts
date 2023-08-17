import { W3CVerifiableCredential, ProofFormat } from '@veramo/core'

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

export { signVerifiablePresentation }
