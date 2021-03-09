import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import PostForm from './PostForm'

const Module = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        New post
      </Button>
      <Modal title="New post" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <PostForm onFinish={handleOk}/>
      </Modal>
    </>
  )
}
export default Module