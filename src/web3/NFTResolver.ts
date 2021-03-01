import { parse } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

export function NFTResolver(provider: any) {
  const resolve = getResolver({provider}).ethr

  return async function(did: string) {
    const split = did.split(':')
    const res = await (await fetch(`https://api.opensea.io/api/v1/asset/${split[3]}/${split[4]}/`)).json()
    //FIXME 
    const ethrDid = 'did:ethr:' + res.top_ownerships[0].owner.address
    const parsed = parse(ethrDid)
    const didDoc = resolve(ethrDid, parsed)
    return didDoc
  }
}