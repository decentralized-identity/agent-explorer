import { TransactionRequest, Web3Provider } from '@ethersproject/providers'
import {
  TKeyType,
  IKey,
  ManagedKeyInfo,
  MinimalImportableKey,
} from '@veramo/core'
import { AbstractKeyManagementSystem } from '@veramo/key-manager'
import { toUtf8String } from '@ethersproject/strings'
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import { parse } from '@ethersproject/transactions'
// import Debug from 'debug'
// const debug = Debug('veramo:kms:web3')

type Eip712Payload = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  primaryType: string
  message: Record<string, any>
}

export class Web3KeyManagementSystem extends AbstractKeyManagementSystem {
  private web3Provider: Web3Provider
  constructor(private provider: any) {
    super()
    this.web3Provider = new Web3Provider(provider)
  }

  async createKey({ type }: { type: TKeyType }): Promise<ManagedKeyInfo> {
    throw Error('Not implemented')
  }

  async importKey(
    args: Omit<MinimalImportableKey, 'kms'>,
  ): Promise<ManagedKeyInfo> {
    // throw Error('Not implemented')
    return args as any as ManagedKeyInfo
  }

  async listKeys(): Promise<ManagedKeyInfo[]> {
    throw Error('Not implemented')
  }

  async sharedSecret(args: {
    myKeyRef: Pick<IKey, 'kid'>
    theirKey: Pick<IKey, 'type' | 'publicKeyHex'>
  }): Promise<string> {
    throw Error('Not implemented')
  }

  async deleteKey(args: { kid: string }) {
    // this kms doesn't need to delete keys
    return true
  }

  async sign({
    keyRef,
    algorithm,
    data,
  }: {
    keyRef: Pick<IKey, 'kid'>
    algorithm?: string
    data: Uint8Array
  }): Promise<string> {
    if (algorithm) {
      if (
        ['eth_signTransaction', 'signTransaction', 'signTx'].includes(algorithm)
      ) {
        return await this.eth_signTransaction(data)
      } else if (algorithm === 'eth_signMessage') {
        return await this.eth_signMessage(data)
      } else if (
        ['eth_signTypedData', 'EthereumEip712Signature2021'].includes(algorithm)
      ) {
        return await this.eth_signTypedData(data)
      }
    }

    throw Error(`not_supported: Cannot sign ${algorithm} `)
  }

  /**
   * @returns a `0x` prefixed hex string representing the signed EIP712 data
   */
  private async eth_signTypedData(data: Uint8Array) {
    let msg, msgDomain, msgTypes
    const serializedData = toUtf8String(data)
    try {
      let jsonData = JSON.parse(serializedData) as Eip712Payload
      if (
        typeof jsonData.domain === 'object' &&
        typeof jsonData.types === 'object'
      ) {
        const { domain, types, message } = jsonData
        msg = message
        msgDomain = domain
        msgTypes = types
      } else {
        // next check will throw since the data couldn't be parsed
      }
    } catch (e) {
      // next check will throw since the data couldn't be parsed
    }
    if (
      typeof msgDomain !== 'object' ||
      typeof msgTypes !== 'object' ||
      typeof msg !== 'object'
    ) {
      throw Error(
        `invalid_arguments: Cannot sign typed data. 'domain', 'types', and 'message' must be provided`,
      )
    }

    const signature = await this.web3Provider
      .getSigner()
      ._signTypedData(msgDomain, msgTypes, msg)
    return signature
  }

  /**
   * @returns a `0x` prefixed hex string representing the signed message
   */
  private async eth_signMessage(rawMessageBytes: Uint8Array) {
    const signature = await this.web3Provider
      .getSigner()
      .signMessage(rawMessageBytes)
    // HEX encoded string, 0x prefixed
    return signature
  }

  /**
   * @returns a `0x` prefixed hex string representing the signed raw transaction
   */
  private async eth_signTransaction(rlpTransaction: Uint8Array) {
    const { v, r, s, from, ...tx } = parse(rlpTransaction)

    //FIXME
    // if (from) {
    //   debug('WARNING: executing a transaction signing request with a `from` field.')
    //   if (this.web3Provider.address.toLowerCase() !== from.toLowerCase()) {
    //     const msg =
    //       'invalid_arguments: eth_signTransaction `from` field does not match the chosen key. `from` field should be omitted.'
    //     debug(msg)
    //     throw new Error(msg)
    //   }
    // }
    const signedRawTransaction = await this.web3Provider
      .getSigner()
      .signTransaction(tx as TransactionRequest)
    // HEX encoded string, 0x prefixed
    return signedRawTransaction
  }
}
