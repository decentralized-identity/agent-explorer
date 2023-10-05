import React, { useEffect, useState } from 'react'
import { VerifiableCredentialComponent } from "./VerifiableCredentialComponent.js";
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import "highlight.js/styles/base16/solarized-dark.css";
import { IDataStore, UniqueVerifiableCredential } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { Spin } from 'antd';
import { usePlugins } from '../PluginProvider.js';
import { v4 } from 'uuid'

const md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
          try {
              return hljs.highlight(str, { language: lang }).value;
          } catch (e) {
              console.error(e);
              /* empty */
          }
      }

      return ''; // use external default escaping
  },
})

export const MarkDown: React.FC<{ content: string}> = ({ content }: { content: string}) => {
    const { plugins } = usePlugins()

    const markDownPlugins = React.useMemo(() => {
      const result: MarkdownIt.PluginSimple[] = []
      plugins.forEach((plugin) => {
        if (plugin.config?.enabled && plugin.getMarkdownPlugins) {
          const mPlugins = plugin.getMarkdownPlugins()
          result.push(...mPlugins)
        }
      })
      return result
    }, [plugins])

    markDownPlugins.forEach((plugin) => {
      console.log('use', plugin)
      // @ts-ignore
      md.use(plugin())
    })

    const parsed = md.parse(content, {})

    return (<>
      {parsed.map((token, index) => {

      let Result: React.JSX.Element | undefined = undefined
      plugins.forEach((plugin) => {
        if (!Result && plugin.config?.enabled && plugin.getMarkdownComponent) {
          const Component = plugin.getMarkdownComponent(token)
          if (Component) {
            Result = Component
          }
        }
      })

      if (Result) {
        return React.cloneElement(Result, { key: index })
      }

      return <div key={index} dangerouslySetInnerHTML={{ __html: md.renderer.render([token], {}, {}) }} />
    })}</>);
}

export const CredentialLoader: React.FC<{ hash: string, did?: string}> = ({ hash, did }) => {
  
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

    return credential ? <VerifiableCredentialComponent credential={credential} /> : <Spin />
}

