import { Web3Provider } from '@ethersproject/providers'
import { TKeyType, IKey, EcdsaSignature } from '@veramo/core'
import { AbstractKeyManagementSystem } from '@veramo/key-manager'
import { normalizeCredential } from 'did-jwt-vc'


const getEIP712Schema = () => ({
  VerifiableCredential: [
    { name: '@context', type: 'string[]' },
    { name: 'type', type: 'string[]' },
    { name: 'id', type: 'string' },
    { name: 'issuer', type: 'Issuer' },
    { name: 'issuanceDate', type: 'string' },
    { name: 'credentialSubject', type: 'CredentialSubject' },
    { name: 'credentialSchema', type: 'CredentialSchema' }
  ],
  Issuer: [
    { name: 'id', type: 'string' }
  ],
  CredentialSchema: [
    { name: 'id', type: 'string' },
    { name: 'type', type: 'string' },
  ],
  CredentialSubject: [
    { name: 'type', type: 'string' },
    { name: 'id', type: 'string' },
    { name: 'headline', type: 'string' },
    { name: 'articleBody', type: 'string' },
    { name: 'author', type: 'Person' }
  ],
  Person: [
    // { name: 'type', type: 'string' },
    { name: 'id', type: 'string' },
    // { name: 'thumbnail', type: 'string' },
    { name: 'image', type: 'string' },
    { name: 'name', type: 'string' }
  ]
})

const getDomain = (activeChainId: number) => ({
  name: 'Sign Tweet',
  version: '1',
  chainId: activeChainId,
})


export class Web3KeyManagementSystem extends AbstractKeyManagementSystem {
  constructor(private provider: any) {
    super()
  }

  async createKey({ type }: { type: TKeyType }): Promise<Omit<IKey, 'kms'>> {
    throw Error('Not implemented')
  }

  async deleteKey(args: { kid: string }) {
    // this kms doesn't need to delete keys
    return true
  }

  async encryptJWE({
    key,
    to,
    data,
  }: {
    key: IKey
    to: IKey
    data: string
  }): Promise<string> {
    throw Error('Not implemented')
  }

  async decryptJWE({
    key,
    data,
  }: {
    key: IKey
    data: string
  }): Promise<string> {
    throw Error('Not implemented')
  }

  async signEthTX({
    key,
    transaction,
  }: {
    key: IKey
    transaction: object
  }): Promise<string> {
    throw Error('Not implemented')
    // this.provider.send
    // return sign(transaction, '0x' + key.privateKeyHex)
  }

  async signJWT({
    key,
    data,
  }: {
    key: IKey
    data: string
  }): Promise<EcdsaSignature | string> {
    // const p = await this.provider as any
    const web3Provider = new Web3Provider(this.provider)
    const { chainId } = await web3Provider.getNetwork()

    // Hacky payload transformation
    const w3c_vc = normalizeCredential(`${data}.signature`) as any
    // Fix signing output
    delete w3c_vc.proof

    // signature is 0x hex endcoded.
    const signature = await web3Provider.getSigner()._signTypedData(getDomain(chainId), getEIP712Schema(), w3c_vc)
    return 'WEB3' + signature
  }
}
