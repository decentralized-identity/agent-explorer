import React, { useState } from 'react'
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  Row,
  Card,
  Space,
  Checkbox,
} from 'antd'

import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery, useQueryClient } from 'react-query'
import { ICredentialRequestInput, Issuer } from '@veramo/selective-disclosure'

interface CreateRequestProps {}

interface SDRArgs {
  issuer: string
  subject?: string
  claims: ICredentialRequestInput[]
  replyUrl?: string
}

interface AddClaimArgs {
  claimType: string
  claimValue?: string
  issuers?: Issuer[]
  essential: boolean
  reason?: string
}

const CreateRequest: React.FC<CreateRequestProps> = ({}) => {
  const { agent } = useVeramo()
  const query = useQueryClient()
  const [subject, setSubject] = useState<string>('')
  const [issuer, setIssuer] = useState<string>('')
  const [claimType, setClaimType] = useState<string>('')
  const [claimValue, setClaimValue] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [claimRequired, setClaimRequired] = useState<boolean>(false)
  const [replyUrl, setReplyUrl] = useState<string>()
  const [requiredIssuers, setRequiredIssuers] = useState<Issuer[]>([])
  const [requiredIssuer, setRequiredIssuer] = useState<string>('')
  const [requiredIssuerUrl, setRequiredIssuerUrl] = useState<string>('')
  const [claims, setClaims] = useState<ICredentialRequestInput[]>([])
  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const addRequiredIssuer = (did: string, url?: string) => {
    setRequiredIssuers((s) => s?.concat([{ did, url: url || '' }]))

    setRequiredIssuer('')
    setRequiredIssuerUrl('')
  }

  const addClaim = (addClaimArgs: AddClaimArgs) => {
    setClaims((s) =>
      s?.concat([
        {
          claimType: addClaimArgs.claimType,
          claimValue: addClaimArgs.claimValue,
          issuers: addClaimArgs.issuers,
          essential: addClaimArgs.essential,
          reason: addClaimArgs.reason,
        },
      ]),
    )

    setClaimType('')
    setClaimValue('')
    setReplyUrl('')
    setRequiredIssuers([])
  }

  const createSDR = async (sdrArgs: SDRArgs) => {
    const request = await agent?.createSelectiveDisclosureRequest({
      data: {
        subject: sdrArgs.subject,
        issuer: sdrArgs.issuer,
        claims: sdrArgs.claims,
      },
    })

    if (request) {
      await agent?.handleMessage({ raw: request, save: true })
      query.invalidateQueries(['requests'])
    }

    setIssuer('')
    setSubject('')
    setReplyUrl('')
    setClaims([])
  }

  return (
    <Card title="Create Selective Disclosure Request">
      <Form layout="vertical">
        <pre>
          <code>{JSON.stringify(claims, null, 2)}</code>
        </pre>
        <Row>
          <Form.Item label="Issuer">
            <Input
              type="text"
              style={{ width: 250, marginRight: 15 }}
              onChange={(e) => setIssuer(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Subject">
            <Input
              type="text"
              style={{ width: 250 }}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label="Reply url">
            <Input
              type="text"
              style={{ width: 250 }}
              onChange={(e) => setReplyUrl(e.target.value)}
            />
          </Form.Item>
        </Row>

        <Card>
          <Row>
            <Form.Item label="Claim type">
              <Input
                value={claimType}
                type="text"
                style={{ width: 250, marginRight: 15 }}
                onChange={(e) => setClaimType(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Claim value">
              <Input
                value={claimValue}
                type="text"
                style={{ width: 250 }}
                onChange={(e) => setClaimValue(e.target.value)}
              />
            </Form.Item>
          </Row>

          <Row>
            <Form.Item label="Reason">
              <Input
                value={reason}
                type="text"
                style={{ width: 500 }}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Item>
          </Row>
          <pre>
            <code>{JSON.stringify(requiredIssuers, null, 2)}</code>
          </pre>
          <Card>
            <Row>
              <Form.Item label="Issuer">
                <Input
                  value={requiredIssuer}
                  type="text"
                  style={{ width: 250, marginRight: 15 }}
                  onChange={(e) => setRequiredIssuer(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Issuer Url">
                <Input
                  value={requiredIssuerUrl}
                  type="text"
                  style={{ width: 250 }}
                  onChange={(e) => setRequiredIssuerUrl(e.target.value)}
                />
              </Form.Item>
            </Row>
            <Button
              type="ghost"
              disabled={!requiredIssuer}
              onClick={() =>
                addRequiredIssuer(requiredIssuer, requiredIssuerUrl)
              }
            >
              Add issuer
            </Button>
          </Card>
          <Button
            type="ghost"
            disabled={!claimType}
            onClick={() =>
              addClaim({
                claimType,
                claimValue,
                issuers: requiredIssuers,
                essential: claimRequired,
                reason,
              })
            }
          >
            Add claim
          </Button>
          <Checkbox
            value={claimRequired}
            style={{ marginLeft: 15 }}
            onChange={(e) => setClaimRequired(e.target.checked)}
          >
            Required claim
          </Checkbox>
        </Card>
        <Button
          type="primary"
          disabled={claims.length === 0 || !issuer}
          onClick={() =>
            createSDR({
              issuer,
              subject,
              claims: claims || [],
              replyUrl: '',
            })
          }
        >
          Create request
        </Button>
      </Form>
    </Card>
  )
}

export default CreateRequest
