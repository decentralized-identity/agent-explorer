import React from 'react'
import { Layout } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'

interface WidgetProps {
  cacheKey: string
}

const { agent } = useVeramo()

const Widget: React.FC<WidgetProps> = () => {
  return <Layout></Layout>
}

export default Widget
