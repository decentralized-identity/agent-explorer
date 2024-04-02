import { IAgentContext, IDataStore } from '@veramo/core-types'
import { AbstractMessageHandler, Message } from '@veramo/message-handler'
// import Debug from 'debug'
// const debug = Debug('veramo:did-comm:message-handler')

type IContext = IAgentContext<IDataStore>

/**
 * A plugin for the {@link @veramo/message-handler#MessageHandler} that decrypts DIDComm messages.
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class SaveMessageHandler extends AbstractMessageHandler {
  constructor() {
    super()
  }
  /**
   * Handles a new packed DIDCommV2 Message (also Alpha support but soon deprecated).
   * - Tests whether raw message is a DIDCommV2 message
   * - Unpacks raw message (JWM/JWE/JWS, or plain JSON).
   * -
  */
 async handle(message: Message, context: IContext): Promise<Message> {
    // WIP: not sure if this works
    if (message.type === 'https://didcomm.org/basicmessage/2.0/message') {

      let localMessage

      // function throws an error if message not found
      try {
        localMessage = await context.agent.dataStoreGetMessage({ id: message.id })
      } catch(ex) {
        console.log("incoming message not already saved.")
      }
      if (!localMessage) {
        console.log('Saving message', message)
        await context.agent.dataStoreSaveMessage({ message })
        if (message.attachments && message.attachments.length > 0) {
          console.log("attachments found")
          for (const attachment of message.attachments) {
            if (attachment.media_type === 'credential+ld+json') {
              const credential = await context.agent.dataStoreSaveVerifiableCredential({ verifiableCredential: attachment.data.json})
              console.log("saved attached credential: ", credential)
            }
          }
      }
      }
    } 

    return super.handle(message, context)
  }
}
