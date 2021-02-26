import { IIdentifier } from '@veramo/core'
import { AbstractDIDStore } from '@veramo/did-manager'

export class MemoryDIDStore extends AbstractDIDStore {
  private identifiers: Record<string, IIdentifier> = {}

  async get({
    did,
    alias,
    provider,
  }: {
    did: string
    alias: string
    provider: string
  }): Promise<IIdentifier> {
    if (did !== undefined && alias === undefined) {
      return this.identifiers[did]
    } else if (
      did === undefined &&
      alias !== undefined &&
      provider !== undefined
    ) {
      for (const key of Object.keys(this.identifiers)) {
        if (
          this.identifiers[key].alias === alias &&
          this.identifiers[key].provider === provider
        ) {
          return this.identifiers[key]
        }
      }
    } else {
      throw Error('Get requires did or (alias and provider)')
    }
    throw Error('Identifier not found')
  }

  async delete({ did }: { did: string }) {
    delete this.identifiers[did]
    return true
  }

  async import(args: IIdentifier) {
    this.identifiers[args.did] = args
    return true
  }

  async list(args: {
    alias?: string
    provider?: string
  }): Promise<IIdentifier[]> {
    let result: IIdentifier[] = []

    for (const key of Object.keys(this.identifiers)) {
      result.push(this.identifiers[key])
    }

    if (args.alias) {
      result = result.filter((i) => i.alias !== args.alias)
    }

    if (args.provider) {
      result = result.filter((i) => i.provider !== args.provider)
    }

    return result
  }
}
