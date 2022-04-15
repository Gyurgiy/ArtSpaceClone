import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(function routes(app, opts, done) {
  const localEnvFile = './.local-env.json'
  const env = {
    // Режим отладки
    debugMode: process.env.DEBUG_MODE === 'true',
    // Порт запуска сервиса, по умолчанию 8080
    port: process.env.PORT || 8080,
    // Параметры подключения к сервису почты
    defaultMailService: process.env.DEFAULT_MAIL_SERVICE,
    defaultMailUser: process.env.DEFAULT_MAIL_USER,
    defaultMailPass: process.env.DEFAULT_MAIL_PASS,
    // Парамеры подключения к БД
    connectionString: process.env.DATABASE_URL || `sqlite:${resolve('.local-database.sqlite')}`
  }

  if (existsSync(localEnvFile)) {
    const localEnv = JSON.parse(readFileSync(localEnvFile, 'utf-8'))

    Object.assign(env, localEnv)
  }

  app.decorate('env', env)
  done()
})
