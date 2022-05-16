import {
  IAgentPlugin,
  IPluginMethodMap,
  IAgentContext,
  IDataStoreORM,
} from '@veramo/core'
import { IProfile } from '../types'
import parse from 'url-parse'
import md5 from 'md5'

type IContext = IAgentContext<IDataStoreORM>
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

export interface IGetProfileArgs {
  /**
   * Decentralized identifier
   */
  did?: string
}

export interface IProfileManager extends IPluginMethodMap {
  getProfile(args: IGetProfileArgs, context: IContext): Promise<IProfile>
}

export class ProfileManager implements IAgentPlugin {
  readonly methods: IProfileManager = {
    getProfile: this.getProfile.bind(this),
  }

  private async getProfile(
    args: IGetProfileArgs,
    context: IContext,
  ): Promise<IProfile> {
    if (!args.did) return Promise.reject('DID Required')

    const defaultPictureUrl = GRAVATAR_URI + md5(args.did) + '?s=200&d=retro'

    if (args.did.substr(0, 3) !== 'did') {
      const parsed = parse(args.did)
      return {
        did: args.did,
        name: parsed.hostname,
        nickname: parsed.pathname,
        picture: defaultPictureUrl,
      }
    }

    if (args.did.substr(0, 7) === 'did:nft') {
      const split = args.did.split(':')
      const asset = await (
        await fetch(
          `https://api.opensea.io/api/v1/asset/${split[3]}/${split[4]}/`,
        )
      ).json()

      return {
        did: args.did,
        name: asset?.name,
        nickname: asset?.description,
        picture: asset?.image_preview_url,
      }
    }

    if (
      !context.agent
        .availableMethods()
        .includes('dataStoreORMGetVerifiableCredentials')
    ) {
      return { did: args.did, name: args.did, picture: defaultPictureUrl }
    }
    const result = await context.agent.dataStoreORMGetVerifiableCredentials({
      where: [
        { column: 'type', value: ['VerifiableCredential,Profile'] },
        { column: 'subject', value: [args.did] },
      ],
      order: [{ column: 'issuanceDate', direction: 'DESC' }],
    })
    if (result.length > 0) {
      const { name, nickname, picture } =
        result[0].verifiableCredential.credentialSubject
      return { did: args.did, name, nickname, picture }
    } else {
      return { did: args.did, name: args.did, picture: defaultPictureUrl }
    }
  }
}
