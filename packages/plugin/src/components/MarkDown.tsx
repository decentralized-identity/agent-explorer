import React, { useEffect, useState } from 'react'
import { VerifiableCredentialComponent } from './VerifiableCredentialComponent.js'
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import "highlight.js/styles/base16/solarized-dark.css";
import { IDataStore, UniqueVerifiableCredential } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { Spin } from 'antd';
import { usePlugins } from '../PluginProvider.js';

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
    const parsed = md.parse(content, {})

    return (<>
      {parsed.map((token, index) => {

      let Result: React.FC | undefined = undefined
      plugins.forEach((plugin) => {
        if (!Result && plugin.config?.enabled && plugin.getMarkdownComponent) {
          const Component = plugin.getMarkdownComponent(token)
          if (Component) {
            Result = Component
          }
        }
      })

      if (Result) {
        return Result
      }

      return <div key={index} dangerouslySetInnerHTML={{ __html: md.renderer.render([token], {}, {}) }} />
    })}</>);
}

export const CredentialLoader: React.FC<{ hash: string, did?: string}> = ({ hash, did }) => {
  
    const [credential, setCredential] = useState<UniqueVerifiableCredential>()
    const { agent } = useVeramo<IDataStore>()
  
    useEffect(() => {
      const load = async () => {
        const verifiableCredential = await agent?.dataStoreGetVerifiableCredential({
          hash,
        });
  
        if (verifiableCredential) {
          setCredential({hash, verifiableCredential})
        } else {
          // TRY IPFS or DIDComm
        }
      }

      load()
    }, [agent, hash])

    return credential ? <VerifiableCredentialComponent credential={credential} /> : <Spin />
}

