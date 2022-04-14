import fastifyPlugin from 'fastify-plugin'
import * as socketIo from 'socket.io'
import easyrtc from 'open-easyrtc'

export default fastifyPlugin(function routes(app, opts, done) {
  // Старт Socket.io
  const socketServer = new socketIo.Server(app.server)
  const myIceServers = [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' },
    { url: 'stun:stun3.l.google.com:19302' }
  ]

  easyrtc.setOption('logLevel', app.env.debugMode ? 'debug' : 'error')
  easyrtc.setOption('appIceServers', myIceServers)
  easyrtc.setOption('demosEnable', false)
  easyrtc.setOption('apiEnable', false)

  // Старт EasyRTC
  easyrtc.listen(null, socketServer, null, (err, rtcRef) => {
    if (err) {
      console.error(err)
      process.exit()
    }
    console.log('EasyRTC Initiated')
    rtcRef.events.on('roomCreate', (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
      console.log('roomCreate fired! Trying to create: ' + roomName)
      appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback)
    })
  })

  done()
})
