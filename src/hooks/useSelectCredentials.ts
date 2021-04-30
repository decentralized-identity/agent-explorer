import { useState, useEffect, useCallback } from 'react'

interface ValidationState {
  [index: string]: {
    required: boolean
    vc: string | null
  }
}

const useSelectedCredentials = (sdr: any) => {
  const [selected, setSelected] = useState<ValidationState>({})
  const [valid, setValid] = useState<boolean>(true)

  const onSelect = (vc: string | null, claimType: string) => {
    const newState = {
      ...selected,
      [claimType]: { ...selected[claimType], vc },
    }

    setSelected(newState)
  }

  const checkValidity = useCallback(() => {
    let valid = true
    Object.keys(selected).map((key) => {
      if (selected[key].required && !selected[key].vc) {
        valid = false
      }
    })
    setValid(valid)
  }, [selected])

  useEffect(() => {
    checkValidity()
  }, [selected])

  useEffect(() => {
    if (sdr) {
      let defaultSelected: ValidationState = {}
      sdr.map((sdr: any) => {
        if (sdr && sdr.essential) {
          if (sdr.credentials.length) {
            defaultSelected[sdr.claimType] = {
              required: true,
              vc: sdr.credentials[0],
            }
          } else {
            defaultSelected[sdr.claimType] = {
              required: true,
              vc: null,
            }
            setValid(false)
          }
        }
      })
      setSelected(defaultSelected)
    }
  }, [sdr])

  return { selected, valid, onSelect }
}

export default useSelectedCredentials
