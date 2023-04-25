import React, { useState } from 'react'
import { Modal, Input, SelectProps, AutoComplete } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { shortId } from '../utils/did'

interface NewChatThreadModalProps {
  visible: boolean
  onCreate: (did: string) => void
  onCancel: () => void
}

const NewChatThreadModal: React.FC<NewChatThreadModalProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const { agent } = useVeramo<IDIDDiscovery>()
  const [options, setOptions] = useState<SelectProps<object>['options']>([])
  const [did, setDid] = useState<string>('')

  const searchResult = async (query: string) => {
    const response = await agent?.discoverDid({ query })
    const selectOptions: Array<{ value: string; label: any }> = []
    response?.results.forEach((r) => {
      r.matches.forEach((m) => {
        selectOptions.push({
          value: m.did,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{shortId(m.did)}</span>
              <span>{r.provider}</span>
            </div>
          ),
        })
      })
    })
    return selectOptions
  }

  const handleSearch = async (value: string) => {
    setOptions(value ? await searchResult(value) : [])
  }
  return (
    <Modal
      open={visible}
      title="Start new thread"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        onCreate(did)
      }}
    >
      <AutoComplete
        dropdownMatchSelectWidth={true}
        style={{ width: '100%' }}
        options={options}
        onSelect={(e) => setDid(e)}
        onSearch={handleSearch}
      >
        <Input
          value={did}
          onChange={(e) => setDid(e.target.value)}
          style={{
            flex: 1,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        />
      </AutoComplete>
    </Modal>
  )
}

export default NewChatThreadModal
