import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useVeramo } from '@veramo-community/veramo-react'
import { IProfileManager } from '../../agent/ProfileManager'
import { Avatar } from 'antd'

interface Props {
  did: string
}

const Module: React.FC<Props> = ({
  did,
}) => {
  const { agent } = useVeramo<IProfileManager>()
  const { data } = useQuery(
    ['profile' + did, { agentId: agent?.context.id }],
    () => agent?.getProfile({ did }),
    {
      enabled: !!did,
      initialData: {
        did: did,
        name: did,
        nickname: did,
        picture: '',
      }
    },
  )

  return (
    <Link to={'/identifier/' + did}>
      <Avatar src={data?.picture} />
      {data?.name} - {data?.nickname}
    </Link>
  )
}

export default Module
