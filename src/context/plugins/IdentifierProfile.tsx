import { IAgentPlugin, IPluginMethodMap, IAgentContext } from '@veramo/core'
import { IDataStoreORM } from '@veramo/data-store'
import parse from 'url-parse'
import { shortId } from '../../utils/did'
import md5 from 'md5'

export interface IIdentifierProfile {
  did: string
  name?: string
  picture?: string
}

type IContext = IAgentContext<IDataStoreORM>

export interface IGetIdentifierProfileArgs {
  /**
   * Decentralized identifier
   */
  did?: string
}

export interface IIdentifierProfilePlugin extends IPluginMethodMap {
  getIdentifierProfile(
    args: IGetIdentifierProfileArgs,
    context: IContext,
  ): Promise<IIdentifierProfile>
}

export class IdentifierProfilePlugin implements IAgentPlugin {
  readonly methods: IIdentifierProfilePlugin = {
    getIdentifierProfile: this.getIdentifierProfile.bind(this),
  }

  private async getIdentifierProfile(
    args: IGetIdentifierProfileArgs,
    context: IContext,
  ): Promise<IIdentifierProfile> {
    if (!args.did) return Promise.reject('DID Required')

    const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'
    const fallBackPictureUrl = GRAVATAR_URI + md5(args.did) + '?s=200&d=retro'

    // If the DID is not a DID, then it is a URL
    if (args.did.substr(0, 3) !== 'did') {
      const parsed = parse(args.did)
      return {
        did: args.did,
        name: parsed.hostname,
        picture: fallBackPictureUrl,
      }
    }

    // Try to get the profile from Verifiable Credentials in the data store
    if (
      context.agent
        .availableMethods()
        .includes('dataStoreORMGetVerifiableCredentials')
    ) {
      try {
        const result = await context.agent.dataStoreORMGetVerifiableCredentials(
          {
            where: [
              { column: 'type', value: ['VerifiableCredential,Profile'] },
              { column: 'subject', value: [args.did] },
            ],
            order: [{ column: 'issuanceDate', direction: 'DESC' }],
          },
        )
        if (result.length > 0) {
          const { name, picture } =
            result[0].verifiableCredential.credentialSubject
          return { did: args.did, name, picture }
        }
      } catch (e) {}
    }

    // Try to use alias from the DID Manager
    if (context.agent.availableMethods().includes('didManagerGet')) {
      try {
        const identifier = await context.agent.didManagerGet({ did: args.did })
        if (identifier) {
          return {
            did: args.did,
            name: identifier.alias,
            picture: fallBackPictureUrl,
          }
        }
      } catch (e) {}
    }

    return {
      did: args.did,
      name: shortId(args.did),
      picture: fallBackPictureUrl,
    }
  }
}