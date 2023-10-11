import React, { PropsWithChildren, useEffect, useState } from 'react'
import { VerifiableCredentialComponent } from "./VerifiableCredentialComponent.js";
import { IDataStore, UniqueVerifiableCredential } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { Button, Spin } from 'antd';
import { usePlugins } from '../PluginProvider.js';
import { v4 } from 'uuid'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PluggableList } from 'unified'

export const MarkDown = (
  { content, credential, context }: 
  { content: string, credential?: UniqueVerifiableCredential, context?: any}
) => {

    const { plugins } = usePlugins()
    const [ showAll, setShowAll ] = useState<boolean>(context?.textRange ? false : true)

    const {remarkPlugins, components} = React.useMemo(() => {
      const remarkPlugins: PluggableList = [remarkGfm]
      let components: Partial<Components> = {}
      plugins.forEach((plugin) => {
        if (plugin.config?.enabled && plugin.getRemarkPlugins) {
          const rPlugins = plugin.getRemarkPlugins()
          remarkPlugins.push(...rPlugins)
        }
        if (plugin.config?.enabled && plugin.getMarkdownComponents) {
          const rComponents = plugin.getMarkdownComponents()
          components = {...components, ...rComponents}
        }
      })
      return {remarkPlugins, components}
    }, [plugins])

    let str = content

    if (!showAll && context?.textRange) {
      const [ start, end ] = context.textRange.split('-')
      str = content.substring(start, end)
    }

    return (
      <>
        <Markdown 
          remarkPlugins={remarkPlugins}
          rehypePlugins={[[remarkCredentialPlugin, credential]]}
          components={components}
          >{str}</Markdown>
        {!showAll && context?.textRange && <Button type='text' size='small' onClick={() => setShowAll(true)}>Show more</Button>}
        {showAll && context?.textRange && <Button type='text' size='small' onClick={() => setShowAll(false)}>Show less</Button>}
      </>
    )
}

function remarkCredentialPlugin(credential: UniqueVerifiableCredential) {
  return (tree: any) => {
    if (Array.isArray(tree.children)) {
      tree.children.forEach((node: any) => {
        if (node.type === 'element' && node.tagName === 'p') {
          node.credential = credential
        }
      });
    }
  };
};

export const CredentialLoader = ({ hash, did, context } : { hash: string, did?: string, context?: any }) => {
  
    const [credential, setCredential] = useState<UniqueVerifiableCredential>()
    const { agent } = useVeramo<IDataStore>()
  
    useEffect(() => {
      const load = async () => {
        let verifiableCredential
        try {
          verifiableCredential = await agent?.dataStoreGetVerifiableCredential({
            hash,
          });
        } catch (ex) {
          console.log("credential not found locally")
        }
  
        if (verifiableCredential) {
          setCredential({hash, verifiableCredential})
        } else {
          // TRY IPFS or DIDComm
          const senders = await agent?.didManagerFind({ provider: "did:peer"})
          if (senders && senders.length > 0) {
            const requestCredMessage = {
              type: 'https://veramo.io/didcomm/brainshare/1.0/request-credential',
              from: senders[0].did,
              to: did,
              id: v4(),
              body: {
                hash
              },
              return_route: 'all'
          }
          const packedMessage = await agent?.packDIDCommMessage({ message: requestCredMessage, packing: 'authcrypt' })
          await agent?.sendDIDCommMessage({ packedMessage: packedMessage!, messageId: requestCredMessage.id, recipientDidUrl: did! })
          const localCred = await agent?.dataStoreGetVerifiableCredential({ hash })
          setCredential({ hash, verifiableCredential: localCred! })
        }
        }
      }

      load()
    }, [agent, hash])

    return credential ? <VerifiableCredentialComponent credential={credential} context={context} /> : <Spin />
}

