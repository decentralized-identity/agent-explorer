import { IAgentContext, IResolver } from '@veramo/core'
import { AbstractMessageHandler, Message } from '@veramo/message-handler'
import { decodeJWT } from 'did-jwt'

export type IContext = IAgentContext<IResolver>


export class Web3JwtMessageHandler extends AbstractMessageHandler {
  async handle(message: Message, context: IContext): Promise<Message> {

    if (message.raw) {
      try {
        //FIXME this is mock signature verification just to explain the concept
        const decoded = decodeJWT(message.raw)
        if (decoded.signature.slice(0,4) === 'WEB3') {
          message.addMetaData({ type: decoded.header.typ || 'JWT', value: decoded.header.alg })
          message.data = decoded.payload
        }

      } catch (e) {
        
      }
    }

    return super.handle(message, context)
  }
}
