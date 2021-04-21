import {
  createAgent,
  IDataStore,
  IDIDManager,
  IKeyManager,
  IResolver,
  IMessageHandler,
} from '@veramo/core'
import { ICredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import { SdrMessageHandler } from '@veramo/selective-disclosure'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { DIDCommMessageHandler, IDIDComm } from '@veramo/did-comm'
import { MessageHandler } from '@veramo/message-handler'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { IDataStoreORM } from '@veramo/data-store'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { useVeramo } from '@veramo-community/veramo-react'

export type AgentInterfaces = IDataStore &
  IDataStoreORM &
  ICredentialIssuer &
  IDIDManager &
  IDIDComm &
  IKeyManager &
  IResolver &
  IMessageHandler

export interface AgentContext {
  name: string
  picture?: string
}

export const useAgent = () => useVeramo<AgentInterfaces, AgentContext>()

export const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

export const defaultAgent = createAgent<AgentInterfaces>({
  context: {
    name: 'Local',
  },
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId }),
        ...webDidResolver(),
      }),
    }),
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
