import { Row, Col } from "antd"
import { PropsWithChildren } from "react"

export const ResponsiveContainer: React.FC<PropsWithChildren> = ({
  children
}) => {
  return (<Row>
    <Col 
      lg={3}
    />
    <Col  
      lg={18}
      sm={24}
      xs={24}
      style={{position: 'relative'}}
      >
        {children} 
      </Col>
      <Col 
        lg={3}
      />
  </Row>)
}