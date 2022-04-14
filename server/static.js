import fastifyPlugin from 'fastify-plugin'
import fastifyCompress from 'fastify-compress'
import fastifyStatic from 'fastify-static'
import { resolve } from 'path'

export default fastifyPlugin(function routes(app, opts, done) {
  app
    .register(fastifyCompress)
    .register(fastifyStatic, {
      root: resolve('client'),
      prefix: '/'
    })

  done()
})
