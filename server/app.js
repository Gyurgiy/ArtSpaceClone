import { resolve } from 'path'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import * as socketIo from 'socket.io'
import easyrtc from 'open-easyrtc'

// Порт запуска сервиса, по умолчанию 8080
const port = process.env.PORT || 8080
// Экземпляр приложения
const app = fastify({ logger: { level: 'error' } })
// Старт приложения по готовности
const start = async () => {
  try {
    // Старт сервиса на указанном порту
    await app.listen(port)
    console.log('listening on http://localhost:' + port)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// Добавление каталога со статикой
app.register(fastifyStatic, {
  root: resolve('client'),
  prefix: '/'
})

// Старт Socket.io
const socketServer = new socketIo.Server(app.server)
const myIceServers = [
  { url: 'stun:stun.l.google.com:19302' },
  { url: 'stun:stun1.l.google.com:19302' },
  { url: 'stun:stun2.l.google.com:19302' },
  { url: 'stun:stun3.l.google.com:19302' }
]

easyrtc.setOption('logLevel', 'error')
easyrtc.setOption('appIceServers', myIceServers)
easyrtc.setOption('demosEnable', false)
easyrtc.setOption('apiEnable', false)

// Старт EasyRTC
easyrtc.listen(null, socketServer, null, (err, rtcRef) => {
  if (err) {
    console.error(err)
    process.exit()
  }
  console.log('Initiated')
  rtcRef.events.on('roomCreate', (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
    console.log('roomCreate fired! Trying to create: ' + roomName)
    appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback)
  })
})

// Старт сервиса
start()
