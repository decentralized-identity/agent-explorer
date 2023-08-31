import { AgentPlugin, IPlugin } from '../types'
import Identifiers  from './identifiers'
import Contacts  from './contacts'
import Statistics  from './statistics'
import AuditLog  from './audit-log'
import CredentialVerifier  from './credential-verifier'
import Credentials  from './credentials'
import Requests  from './requests'
import Chats  from './chats'

const corePlugins: IPlugin[] = [
  Statistics,
  Identifiers,
  Credentials,
  CredentialVerifier,
  Contacts,
  Chats,
  AuditLog,
  Requests,
]

export function getcorePlugins(): AgentPlugin[] {
  return corePlugins.map(plugin => plugin.init())
}