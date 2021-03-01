import React, { useState } from 'react'
import { Button, Card, Input } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IKey } from '@veramo/core'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'



const Module: React.FC = () => {
  const { agent } = useVeramo<IDIDManager>()
  const [address, setAddress] = useState('0xd07dc4262bcdbf85190c01c996b4c06a461d2430')
  const [id, setId] = useState('110820')
  const {
    connector,
    chainId,
    account,
    activate,
    deactivate,
    active,
  } = useWeb3React<Web3Provider>()

  const importDid = async () => {
    try {

      const didDoc = await agent?.resolveDid({
        didUrl: `did:ethr:${account}`,
      })

      await agent?.didManagerImport({
        did: 'did:nft:0x' + chainId + ':' + address + ':' + id,
        provider: 'did:nft',
        controllerKeyId: didDoc.id + '#controller',
        keys: didDoc.publicKey.map(
          (pub: any) =>
            ({
              kid: pub.id,
              type: 'Secp256k1',
              kms: 'web3',
              publicKeyHex: pub.publicKeyHex,
            } as IKey),
        ),
        services: didDoc.service || [],
      })
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <Card title='Add collectible'>
      
        <Input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          placeholder="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <Button onClick={() => importDid()}>Add</Button>
      </Card>

  )
}

export default Module
