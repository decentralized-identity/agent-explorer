import React, { useState } from 'react'
import { Button, Card, Input, List, Image } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { IKey } from '@veramo/core'

interface IdentifierModuleProps {
  address: string
  tokenId: string
}



const Module: React.FC<IdentifierModuleProps> = ({
  address,
  tokenId,
}) => {
  const { agent } = useVeramo()

  const { data, isLoading } = useQuery(
    [address + tokenId],
    () => fetch(`https://api.opensea.io/api/v1/asset/${address}/${tokenId}/`).then(res => res.json()),
    { enabled: !!address },
  )


  return (
    <Card title={'Asset'} style={{ flexWrap: 'wrap' }} loading={isLoading}>
      <Image 
        src={data?.image_preview_url}
        preview={{src: data?.image_url}}
      />
      {data?.name}
    </Card>
  )
}

export default Module
