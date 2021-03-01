import React, { useState } from 'react'
import { Button, Card, Input, List, Image, Avatar } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { IKey } from '@veramo/core'

interface IdentifierModuleProps {
  account: string
}



const Module: React.FC<IdentifierModuleProps> = ({
  account,
}) => {
  const { agent } = useVeramo()

  const { data, isLoading } = useQuery(
    [account],
    () => fetch(`https://api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc&offset=0&limit=20`).then(res => res.json()),
    { enabled: !!account },
  )


  return (
    <Card title={'Collectibles'} style={{ flexWrap: 'wrap' }} loading={isLoading}>
      <List
        dataSource={data?.assets}
        renderItem={(item: any, i: number) => {

          return (
            <List.Item key={i}>
              <List.Item.Meta
                avatar={<Avatar src={item.image_thumbnail_url} />}
                title={
                  <Link to={'/identifiers/did:nft:0x1:' + item.asset_contract.address + ':' + item.token_id}>
                    {item.name}
                  </Link>
                }
                description={`${item.asset_contract.name}`}
              />
            </List.Item>
          )
        }}
      ></List>
    </Card>
  )
}

export default Module
