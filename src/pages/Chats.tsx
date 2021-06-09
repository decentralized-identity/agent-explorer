import React from 'react'
import { Typography, Row, Col, Input } from 'antd'
import Page from '../layout/SplitPage'
import tile from '../static/img/tile.png'

const { Title } = Typography
const { TextArea } = Input

const Overview = () => {
  return (
    <Page
      name="chats"
      header={
        <div
          style={{
            backgroundColor: '#ccc',
            borderBottom: '1px solid white',
            height: 65,
          }}
        >
          Header
        </div>
      }
      leftContent={
        <div
          className="hide-scroll"
          style={{
            backgroundColor: '#fff',
            height: '100%',
            overflow: 'scroll',
          }}
        >
          <div style={{ height: 100, backgroundColor: '#eaeaea' }}>Item</div>
          <div style={{ height: 100, backgroundColor: '#eaeaea' }}>Item</div>
          <div style={{ height: 100, backgroundColor: '#eaeaea' }}>Item</div>
          <div style={{ height: 100, backgroundColor: '#eaeaea' }}>Item</div>
        </div>
      }
      rightContent={
        <div
          style={{
            backgroundImage: `url(${tile})`,
            backgroundRepeat: 'repeat',
            overflow: 'scroll',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Col
            style={{
              flex: 1,
            }}
          >
            <Row style={{ justifyContent: 'flex-start', padding: 20 }}>
              <div
                style={{
                  background: '#fff',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                Chat bubbles
              </div>
            </Row>
            <Row style={{ justifyContent: 'flex-end', padding: 20 }}>
              <div
                style={{
                  background: 'green',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                Chat bubbles
              </div>
            </Row>
            <Row style={{ justifyContent: 'flex-start', padding: 20 }}>
              <div
                style={{
                  background: '#fff',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                Chat bubbles
              </div>
            </Row>
            <Row style={{ justifyContent: 'flex-end', padding: 20 }}>
              <div
                style={{
                  background: 'green',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                Chat bubbles
              </div>
            </Row>
            <Row style={{ justifyContent: 'flex-start', padding: 20 }}>
              <div
                style={{
                  background: '#fff',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                KNAWO;JRGHWFWEH FOIWEHFOIWEFO FWOEFOEQFP NKOENFONEFQEN
              </div>
            </Row>
            <Row style={{ justifyContent: 'flex-end', padding: 20 }}>
              <div
                style={{
                  background: 'green',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                rtjartjarthaetjhaetjaethaehae aerhaerh aer hae rh aerh
              </div>
            </Row>
            <Row style={{ justifyContent: 'flex-start', padding: 20 }}>
              <div
                style={{
                  background: '#fff',
                  padding: '10px 20px',
                  borderRadius: 5,
                }}
              >
                Cwmrgpjaehnpae jpwegpwejg' wePIGJpwiejg fwiEJG;oiweg;
                fg;wIEGHJF;O
              </div>
            </Row>
            <div
              style={{
                background: '#eaeaea',
                padding: 20,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <TextArea
                placeholder="Autosize height based on content lines"
                autoSize
              />
            </div>
          </Col>
        </div>
      }
    ></Page>
  )
}

export default Overview
