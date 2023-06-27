import { TAgent } from '@veramo/core'
import { IDIDComm, createDeliveryRequestMessage, createStatusRequestMessage } from '@veramo/did-comm'

async function pickup(
  agent: TAgent<IDIDComm>,
  recipientDidUrl: string,
  mediatorDidUrl: string,
): Promise<void> {

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
  const status = await agent.sendDIDCommMessage({
    messageId: statusMessage.id,
    packedMessage: packedStatusMessage,
    recipientDidUrl: mediatorDidUrl,
  })
  console.log('status: ', status)

  const deliveryMessage = createDeliveryRequestMessage(
    recipientDidUrl,
    mediatorDidUrl,
  )

  const packedMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: deliveryMessage,
  })

  const result = await agent.sendDIDCommMessage({
    messageId: deliveryMessage.id,
    packedMessage,
    recipientDidUrl: mediatorDidUrl,
  })
  console.log('result: ', result)
}

export { pickup }
