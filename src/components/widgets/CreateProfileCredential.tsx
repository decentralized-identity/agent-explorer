import React, { useState } from 'react'
import { Button, Card, Input, Select } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@veramo/core'
import { issueCredential } from '../../utils/signing'
const { TextArea } = Input
const { Option } = Select

interface CreateProfileCredentialProps extends PageWidgetProps {}

const CreateProfileCredential: React.FC<CreateProfileCredentialProps> = ({
  title,
  isLoading,
  remove,
  removeDisabled,
}) => {
  const { agent } = useVeramo()

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )
  const [issuer, setIssuer] = useState<string>('')
  const [proofFormat, setProofFormat] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [inFlight, setInFlight] = useState(false)

  return (
    <PageWidget
      title={title}
      isLoading={isLoading}
      remove={remove}
      removeDisabled={removeDisabled}
    >
      <Card>
        <Select
          style={{ width: '60%' }}
          loading={identifiersLoading}
          onChange={(e) => setIssuer(e as string)}
          placeholder="issuer DID"
          defaultActiveFirstOption={true}
        >
          {identifiers &&
            identifiers.map((id: IIdentifier) => (
              <Option key={id.did} value={id.did as string}>
                {id.did}
              </Option>
            ))}
        </Select>
        <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <TextArea placeholder="Bio" onChange={(e) => setBio(e.target.value)} />
        <br />
        <br />
        <Select
          style={{ width: '60%' }}
          onChange={(e) => setProofFormat(e as string)}
          placeholder="Proof type"
          defaultActiveFirstOption={true}
        >
          <Option
            key="EthereumEip712Signature2021lds"
            value="EthereumEip712Signature2021"
          >
            EthereumEip712Signature2021
          </Option>
          <Option key="jwt" value="jwt">
            jwt
          </Option>
          <Option key="lds" value="lds">
            lds
          </Option>
        </Select>
        <br />
        <Button
          type="primary"
          disabled={inFlight || !proofFormat || !issuer}
          onClick={async () => {
            try {
              setInFlight(true)
              await issueCredential(
                agent,
                issuer,
                issuer,
                [
                  { type: 'name', value: name },
                  { type: 'bio', value: bio },
                ],
                proofFormat,
                '',
                'ProfileCredentialSchema',
                'did:web:veramo.io;id=62a8ca5d-7e78-4e7b-a2c1-0bf2d37437ad;version=1.0',
              )
              setInFlight(false)
            } catch (ex) {
              setInFlight(false)
            }
          }}
        >
          Create Profile
        </Button>
      </Card>
    </PageWidget>
  )
}

export default CreateProfileCredential
