import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'
import { Bootstrap } from '@libp2p/bootstrap'
import crypto from 'libp2p-crypto'
import { createFromJSON } from '@libp2p/peer-id-factory'
import { stdinToStream, streamToConsole } from './stream.js'
import { Multiaddr } from '@multiformats/multiaddr'
import { fromString } from 'uint8arrays/from-string'
const PeerId = require('peer-id')

export default async function createStream(toPeerId, libp2pNode) {
  // Dial to the remote peer (the "listener")
  const listenerMa = new Multiaddr(
    `/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/p2p/${toPeerId}`,
  )

  console.log('listernerMa: ', listenerMa)

  // const toPeerIdArray = fromString(toPeerId)
  // console.log("toPeerIdArray: ", toPeerIdArray)
  // const toPeer = new PeerId(toPeerIdArray)
  //   console.log("toPeer: ", toPeer)
  const stream = await libp2pNode.dialProtocol(listenerMa, '/didComm/1.0.0')

  console.log('stream: ', stream)

  stream.console.log('Dialer dialed to listener on protocol: /didComm/1.0.0')
  console.log('Type a message and see what happens')

  // Send stdin to the stream
  // stdinToStream(stream)
  // Read the stream and output to console
  // streamToConsole(stream)

  return stream
}
