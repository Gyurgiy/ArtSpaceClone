import { fastify } from 'fastify'

// Экземпляр приложения
const app = fastify({ logger: { level: 'error' } })

// Параметры окружения и опции подключения
app.register(import('./env.js'))
// Добавление каталога со статикой
app.register(import('./static.js'))
// Сервер обмена сообщениями с клиентом
app.register(import('./rtc.js'))
// Сервис рассылки писем
app.register(import('./mail.js'))
// Старт приложения по готовности
app.ready(async () => {
  try {
    // @ts-ignore
    const { port } = app.env

    // Старт сервиса на указанном порту
    await app.listen(port)
    console.log('listening on http://localhost:' + port)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
})
