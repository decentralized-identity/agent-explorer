import {
  createAgent,
  IDIDManager,
  IKeyManager,
  IResolver,
  IKey,
} from '@veramo/core'
import { CredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import { DIDManager } from '@veramo/did-manager'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { DIDComm } from '@veramo/did-comm'
import { KeyManager } from '@veramo/key-manager'
import { SdrMessageHandler } from '@veramo/selective-disclosure'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { DIDCommMessageHandler } from '@veramo/did-comm'
import { MessageHandler } from '@veramo/message-handler'
import { MemoryDIDStore } from './DIDStore'
import { Web3KeyManagementSystem } from './KeyManagementSystem'
import { MemoryKeyStore } from './KeyStore'
import { NFTResolver } from './NFTResolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ProfileManager } from '../agent/ProfileManager'
export async function createWeb3Agent({
  connector,
  chainId,
  account,
}: {
  connector: AbstractConnector
  chainId: number
  account: string
}) {
  const id = 'web3Agent'
  const web3Provider = await connector.getProvider()
  const agent = createAgent<IDIDManager & IKeyManager & IResolver>({
    context: {
      id,
      name: `Web3 injected ${chainId}`,
    },
    plugins: [
      new DIDResolverPlugin({
        resolver: new Resolver({
          ethr: ethrDidResolver({
            provider: web3Provider,
          }).ethr,
          web: webDidResolver().web,
          nft: NFTResolver(web3Provider),
        }),
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          web3: new Web3KeyManagementSystem(web3Provider),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:ethr',
        providers: {
          'did:ethr': new EthrDIDProvider({
            defaultKms: 'web3',
            network: 'mainnet',
            web3Provider: web3Provider,
          }),
        },
      }),
      new CredentialIssuer(),
      new ProfileManager(),
      new DIDComm(),
      new MessageHandler({
        messageHandlers: [
          new DIDCommMessageHandler(),
          new JwtMessageHandler(),
          new W3cMessageHandler(),
          new SdrMessageHandler(),
        ],
      }),
    ],
  })

  const didDoc = await agent.resolveDid({
    didUrl: `did:ethr:${account}`,
  })

  await agent.didManagerImport({
    did: `did:ethr:${account}`,
    provider: 'did:ethr',
    controllerKeyId: didDoc.id + '#controller',
    keys: didDoc.publicKey.map(
      (pub) =>
        ({
          kid: pub.id,
          type: 'Secp256k1',
          kms: 'web3',
          publicKeyHex: pub.publicKeyHex,
        } as IKey),
    ),
    services: didDoc.service || [],
  })

  try {
    const { assets } = await (
      await fetch(
        `https://api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc&offset=0&limit=20`,
      )
    ).json()

    for (const asset of assets) {
      await agent.didManagerImport({
        did: `did:nft:0x${chainId}:${asset.asset_contract.address}:${asset.token_id}`,
        provider: 'did:nft',
        controllerKeyId: didDoc.id + '#controller',
        keys: didDoc.publicKey.map(
          (pub) =>
            ({
              kid: pub.id,
              type: 'Secp256k1',
              kms: 'web3',
              publicKeyHex: pub.publicKeyHex,
            } as IKey),
        ),
        services: didDoc.service || [],
      })
    }
  } catch (e) {
    console.log(e.message)
  }

  return agent
}
