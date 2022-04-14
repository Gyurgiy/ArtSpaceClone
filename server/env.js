import { existsSync, readFileSync } from 'fs'
import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(function routes(app, opts, done) {
  const localEnvFile = './.local-env.json'
  const env = {
    // Порт запуска сервиса, по умолчанию 8080
    port: process.env.PORT || 8080
  }

  if (existsSync(localEnvFile)) {
    const localEnv = JSON.parse(readFileSync(localEnvFile, 'utf-8'))

    Object.assign(env, localEnv)
  }

  app.decorate('env', env)
  done()
})
