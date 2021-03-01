import React from 'react'
import { Card, Image } from 'antd'
import { useQuery } from 'react-query'

interface IdentifierModuleProps {
  address: string
  tokenId: string
}

const Module: React.FC<IdentifierModuleProps> = ({
  address,
  tokenId,
}) => {
 
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
