import { createDeliveryRequestMessage, createStatusRequestMessage } from '@veramo/did-comm'

export async function pickup(
  agent: any,
  recipientDidUrl: string,
  mediatorDidUrl: string,
): Promise<void> {

  if (mediatorDidUrl.startsWith('https')) {
    return
  }

  const statusMessage = createStatusRequestMessage(
    recipientDidUrl,
    mediatorDidUrl,
  )

  // console.log("statusMessage: ", statusMessage)
  const packedStatusMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: statusMessage,
  })
  // console.log("packedStatusMessage: ", packedStatusMessage)
  await agent.sendDIDCommMessage({
    messageId: statusMessage.id,
    packedMessage: packedStatusMessage,
    recipientDidUrl: mediatorDidUrl,
  })
  // console.log('status: ', status)

  const deliveryMessage = createDeliveryRequestMessage(
    recipientDidUrl,
    mediatorDidUrl,
  )

  const packedMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: deliveryMessage,
  })
  await agent.sendDIDCommMessage({
    messageId: deliveryMessage.id,
    packedMessage,
    recipientDidUrl: mediatorDidUrl,
  })
  // console.log('result: ', result)
}
