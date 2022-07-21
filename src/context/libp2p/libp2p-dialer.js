import { Multiaddr } from '@multiformats/multiaddr'

export default async function createStream(toPeerId, libp2pNode) {
  // Dial to the remote peer (the "listener")
  const listenerMa = new Multiaddr(
    `/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/p2p/${toPeerId}`,
  )

  console.log('listernerMa: ', listenerMa)

  const stream = await libp2pNode.dialProtocol(listenerMa, '/didComm/1.0.0')

  console.log('stream: ', stream)

  stream.console.log('Dialer dialed to listener on protocol: /didComm/1.0.0')

  // Send stdin to the stream
  // stdinToStream(stream)
  // Read the stream and output to console
  // streamToConsole(stream)

  return stream
}
