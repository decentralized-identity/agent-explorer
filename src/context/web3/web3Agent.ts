import {
  createAgent,
  IDIDManager,
  IKey,
  IKeyManager,
  IMessageHandler,
  IResolver,
} from '@veramo/core'
import { CredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712,
} from '@veramo/credential-eip712'
import { AbstractIdentifierProvider, DIDManager } from '@veramo/did-manager'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager } from '@veramo/key-manager'
import { SdrMessageHandler } from '@veramo/selective-disclosure'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { MessageHandler } from '@veramo/message-handler'
import { Web3KeyManagementSystem } from '@veramo/kms-web3'

import {
  DataStoreJson,
  DIDStoreJson,
  KeyStoreJson,
  BrowserLocalStorageStore,
  PrivateKeyStoreJson,
} from '@veramo/data-store-json'

import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { MinimalImportableKey } from '@veramo/core'
import { Web3Provider } from '@ethersproject/providers'

import { createBrowserLibp2pNode } from '@veramo/libp2p-utils-browser'
import {
  createLibp2pClientPlugin,
  IAgentLibp2pClient,
} from '@veramo/libp2p-client'
import {
  DIDComm,
  DIDCommHttpTransport,
  DIDCommLibp2pTransport,
  DIDCommMessageHandler,
} from '@veramo/did-comm'

import { KeyManagementSystem } from '@veramo/kms-local'
import { createFromPrivKey, createFromJSON } from '@libp2p/peer-id-factory'
import { PrivateKey } from '@libp2p/interface-keys'
import PeerId from 'peer-id'

const dataStore = BrowserLocalStorageStore.fromLocalStorage('veramo-state')
const infuraProjectId = '3586660d179141e3801c3895de1c2eba'

interface ConnectorInfo {
  provider: Web3Provider
  chainId: number
  accounts: string[]
  name: string
  isActive: boolean
}

export async function createWeb3Agent({
  connectors,
}: {
  connectors: ConnectorInfo[]
}) {
  const didProviders: Record<string, AbstractIdentifierProvider> = {}
  const web3Providers: Record<string, Web3Provider> = {}

  connectors.forEach((info) => {
    didProviders[info.name] = new EthrDIDProvider({
      defaultKms: 'web3',
      network: info.chainId,
      web3Provider: info.provider,
    })
    web3Providers[info.name] = info.provider
  })

  let peerIdJSONString = localStorage.getItem('libp2pPeerId')
  if (!peerIdJSONString) {
    const p = await PeerId.create({ keyType: 'Ed25519' })
    console.log('p: ', p)
    peerIdJSONString = JSON.stringify(p.toJSON(), null, 2)
    localStorage.setItem('libp2pPeerId', peerIdJSONString)
  }
  const peerIdJSON = JSON.parse(peerIdJSONString)
  const peerId = await createFromJSON(peerIdJSON)
  console.log('peerId: ', peerId)

  // const kms = new KeyManagementSystem(new PrivateKeyStoreJson(dataStore))
  // const tempAgent = createAgent<IKeyManager>({
  //   plugins: [
  //     new KeyManager({
  //       store: new KeyStoreJson(dataStore),
  //       kms: {
  //         local: kms
  //       }
  //     })
  //   ]
  // })
  // let keys = (await kms.listKeys()).filter(k => k.type == 'Ed25519')
  // let kid = ""
  // if ((keys).length < 1) {
  //   kid = (await tempAgent.keyManagerCreate({ kms: 'local', type: 'Ed25519' })).kid
  //   // kid = (await kms.createKey({
  //   //   type: 'Ed25519'
  //   // })).kid
  // } else {
  //   kid = keys[0].kid
  // }
  // console.log("kid: ", kid)
  // console.log("dataStore: ", dataStore)
  // // const tempAgent = createAgent<IKeyManager>({
  // //   plugins: [
  // //     new KeyManager({
  // //       store: new KeyStoreJson(dataStore),
  // //       kms: {
  // //         local: kms
  // //       }
  // //     })
  // //   ]
  // // })

  // console.log("tempAgent: ", tempAgent)
  // const key = await tempAgent.keyManagerGet({ kid })
  // console.log("tempAgent")
  // const privateKey = key.privateKeyHex
  // const publicKey = key.publicKeyHex
  // console.log("key: ", key)
  // console.log("publicKey: ", publicKey)
  // console.log("privateKey: ", privateKey)
  // await tempAgent.
  const libnode = await createBrowserLibp2pNode(peerId)
  const libp2pPlugin = await createLibp2pClientPlugin()

  const id = 'web3Agent'
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      ICredentialIssuerEIP712 &
      IAgentLibp2pClient &
      IMessageHandler
  >({
    context: {
      id,
      name: `Web3`,
    },
    plugins: [
      new DIDResolverPlugin({
        resolver: new Resolver({
          ethr: ethrDidResolver({
            infuraProjectId,
            networks: [
              {
                name: 'goerli',
                chainId: 5,
                rpcUrl: 'https://goerli.infura.io/v3/' + infuraProjectId,
              },
            ],
          }).ethr,
          web: webDidResolver().web,
        }),
      }),
      new KeyManager({
        store: new KeyStoreJson(dataStore),
        kms: {
          web3: new Web3KeyManagementSystem(web3Providers),
          local: new KeyManagementSystem(new PrivateKeyStoreJson(dataStore)),
        },
      }),
      new DIDManager({
        store: new DIDStoreJson(dataStore),
        defaultProvider: connectors[0]?.name,
        providers: didProviders,
      }),
      new CredentialIssuer(),
      new CredentialIssuerEIP712(),
      new DataStoreJson(dataStore),
      new MessageHandler({
        messageHandlers: [
          new DIDCommMessageHandler(),
          new JwtMessageHandler(),
          new W3cMessageHandler(),
          new SdrMessageHandler(),
        ],
      }),
      new DIDComm([
        new DIDCommHttpTransport(),
        new DIDCommLibp2pTransport(libnode),
      ]),
      libp2pPlugin,
    ],
  })

  await libp2pPlugin.setupLibp2p({ agent }, libnode)

  // This logic will be moved to a separate veramo plugin,
  // and will be executed automatically
  const identifiers = await agent.didManagerFind()
  for (const identifier of identifiers) {
    if (identifier.keys.filter((key) => key.kms !== 'web3').length === 0) {
      try {
        await agent.didManagerDelete({ did: identifier.did })
      } catch (ex) {
        console.error('ex: ', ex)
      }
    }
  }

  for (const info of connectors) {
    if (info.accounts) {
      for (const account of info.accounts) {
        const did = `did:ethr:0x${info.chainId.toString(16)}:${account}`
        // const controllerKeyId = `${did}#controller`
        const controllerKeyId = `${info.name}-${account}`
        await agent.didManagerImport({
          did,
          provider: info.name,
          controllerKeyId,
          keys: [
            {
              kid: controllerKeyId,
              type: 'Secp256k1',
              kms: 'web3',
              privateKeyHex: '',
              meta: {
                provider: info.name,
                account: account.toLocaleLowerCase(),
                algorithms: ['eth_signMessage', 'eth_signTypedData'],
              },
            } as MinimalImportableKey,
          ],
        })
      }
    }
  }

  return agent
}
