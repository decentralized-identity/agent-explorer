import { UniqueVerifiableCredential } from "@veramo/core-types";
import { MenuProps } from "antd";
import { useNavigate } from 'react-router-dom'

import { MessageOutlined } from "@ant-design/icons";


export const getCredentialContextMenuItems = (credential: UniqueVerifiableCredential): MenuProps['items'] => {
  const navigate = useNavigate()

  const handleSendTo = () => {
    let embed = ''
    if (credential.verifiableCredential.proof?.jwt) {
      embed = `\`\`\`vc+jwt\n${credential.verifiableCredential.proof.jwt}\n\`\`\``
    } else {
      embed = `\`\`\`vc+json\n${JSON.stringify(credential.verifiableCredential, null, 2)}\n\`\`\``
    }

    window.localStorage.setItem('bs-post', embed)
    window.localStorage.setItem('attachment', JSON.stringify(credential.verifiableCredential))
    navigate(`/chats/share`)
  }
  
  return [
    {
      key: 'sendto',
      label: 'Share with ...',
      icon: <MessageOutlined />,
      onClick: handleSendTo
    },

  ]
}