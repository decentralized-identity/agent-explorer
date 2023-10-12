import React from 'react'
import { QRCode } from 'antd'

export const IdentifierTabQRCode: React.FC<{ did: string }> = ({
  did,
}) => {

  return (
    <QRCode value={did} size={320} />
  )
}


