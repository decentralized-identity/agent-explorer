import React from 'react'
import { Typography } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'

interface SubjectKey {
  vcKey: string
  did: string
  renderKey: (hash: string | null, vcKey: any | null) => any
}

const SubjectKey: React.FC<SubjectKey> = ({ vcKey, did, renderKey }) => {
  const { agent } = useVeramo()
  const { data } = useQuery(
    ['credentials', vcKey, did],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsByClaims({
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
        where: [
          { column: 'type', value: [vcKey] },
          { column: 'subject', value: [did] },
        ],
      }),
    {
      enabled: !!vcKey,
    },
  )

  return (
    <>
      {renderKey(
        (data && data[0] && data[0].hash) || null,
        (data &&
          data[0] &&
          data[0].verifiableCredential.credentialSubject[vcKey]) ||
          null,
      )}
    </>
  )
}

export default SubjectKey
