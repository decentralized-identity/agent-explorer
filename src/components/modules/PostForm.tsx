import React, { useState } from 'react'
import { Button, Card, Input } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IKey } from '@veramo/core'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import shortId from 'shortid'
import { sub } from 'date-fns'

interface Props {
  id: string
}

const Module: React.FC<Props> = (props: Props) => {
  const { agent } = useVeramo<IDIDManager>()
  const [postId] = useState('https://example.org/posts/' + shortId())
  const [subject, setSubject] = useState(postId)
  const [headline, setHeadline] = useState('Headline')
  const [articleBody, setArticleBody] = useState('Body')
  const [vc, setVc] = useState()

  const createPost = async () => {
    try {


      const verifiableCredential = await agent?.createVerifiableCredential({
        credential: {
          issuer: { id: props.id },
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://www.w3id.org/veramolabs/socialmedia/context/v1'
          ],
          type: [
            'VerifiableCredential',
            'VerifiableSocialPosting'
          ],
          id: postId,
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: subject,
            type: 'SocialMediaPosting',
            author: {
              id: props.id,
              type: 'Person',
              thumbnail: 'https://google.com',
              image: 'https://google.com',
              name: 'cryptopunk'
            },
            headline,
            articleBody
          },
        },
        proofFormat: 'jwt',
      })
      setVc(verifiableCredential)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <Card title='Create post'>

      <Input
        placeholder='Subject'
        value={subject}
        onChange={(e) => setHeadline(e.target.value)}
      />
      <Input
        placeholder='Headline'
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
      />
      <Input
        placeholder='Article body'
        value={articleBody}
        onChange={(e) => setArticleBody(e.target.value)}
      />

      {vc && (<pre>{JSON.stringify(vc, null, 2)}</pre>)}
      <Button onClick={() => createPost()}>Add</Button>
    </Card>

  )
}

export default Module
