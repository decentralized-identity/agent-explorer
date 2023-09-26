import { InfoCircleOutlined } from "@ant-design/icons";
import { getIssuerDID } from "@veramo-community/agent-explorer-plugin";
import { UniqueVerifiableCredential } from "@veramo/core-types";
import { MenuProps } from "antd";
import { useNavigate } from "react-router";

export const getCredentialContextMenuItems = (credential: UniqueVerifiableCredential): MenuProps['items'] => {
  const navigate = useNavigate()
  const { verifiableCredential } = credential


  return [          {
    key: 'issuer',
    label: 'Issuer',
    icon: <InfoCircleOutlined />,
    onClick: () => navigate('/contacts/' + getIssuerDID(verifiableCredential)),
  },
  {
    key: 'subject',
    label: 'Subject',
    icon: <InfoCircleOutlined />,
    onClick: () =>
      navigate(
        '/contacts/' +
          encodeURIComponent(verifiableCredential.credentialSubject.id as string),
      ),
  },
]}