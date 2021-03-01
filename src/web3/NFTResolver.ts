import { parse } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

export function NFTResolver(provider: any) {
  const resolve = getResolver({provider}).ethr

  return async function(did: string) {
    const [d, method, chainId, address, tokenId ] = did.split(':')
    const res = await (await fetch(`https://api.opensea.io/api/v1/asset/${address}/${tokenId}/`)).json()
    //FIXME 
    const ethrDid = 'did:ethr:' + res.top_ownerships[0].owner.address
    const parsed = parse(ethrDid)
    const didDoc = resolve(ethrDid, parsed)
    return didDoc
  }
}