import { AgentPlugin, IPlugin } from '../types'
import ManagedIdentifiers  from './managed-identifiers'
import KnownIdentifiers  from './known-identifiers'
import Statistics  from './statistics'
import AuditLog  from './audit-log'
import CredentialVerifier  from './credential-verifier'
import Credentials  from './credentials'
import Requests  from './requests'
import Chats  from './chats'

const corePlugins: IPlugin[] = [
  Statistics,
  ManagedIdentifiers,
  Credentials,
  CredentialVerifier,
  KnownIdentifiers,
  Chats,
  AuditLog,
  Requests,
]

export function getcorePlugins(): AgentPlugin[] {
  return corePlugins.map(plugin => plugin.init())
}