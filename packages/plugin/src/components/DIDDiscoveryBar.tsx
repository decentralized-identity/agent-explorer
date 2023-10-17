import React, { useState } from 'react'
import { Input, AutoComplete } from 'antd'

import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { SelectProps } from 'antd/es/select'
import { IdentifierProfile } from '../components/IdentifierProfile.js'

export interface DIDDiscoveryBarProps {
  handleSelect: any
  placeholder?: string
}

export const DIDDiscoveryBar: React.FC<DIDDiscoveryBarProps> = ({
  handleSelect,
  placeholder,
}) => {
  const { agent } = useVeramo<IDIDDiscovery>()
  const [options, setOptions] = useState<SelectProps<object>['options']>([])

  const searchResult = async (query: string) => {
    const response = await agent?.discoverDid({ query })
    const selectOptions: Array<{ value: string; label: any }> = []
    response?.results.forEach((r) => {
      r.matches.forEach((m) => {
        if (selectOptions.find((o) => o.value === m.did)) return
        selectOptions.push({
          value: m.did,
          label: (
            <IdentifierProfile did={m.did} hidePopover/>
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

    <AutoComplete
      dropdownMatchSelectWidth={true}
      style={{ width: '100%', paddingRight: 20 }}
      options={options}
      onSelect={handleSelect}
      onSearch={handleSearch}
      defaultValue={placeholder}
    >
      <Input.Search
        onSearch={handleSelect}
        style={{
          flex: 1,
        }}
      />
    </AutoComplete>


  )
}

