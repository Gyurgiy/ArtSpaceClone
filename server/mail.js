import fastifyPlugin from 'fastify-plugin'
import nodemailer from 'nodemailer'

export default fastifyPlugin(function routes(app, opts, done) {
  const defaultTransporter = nodemailer.createTransport({
    // https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
    service: app.env.defaultMailService,
    auth: {
      user: app.env.defaultMailUser,
      pass: app.env.defaultMailPass
    }
  })
  const mail = {
    sendMailDefault: options => {
      defaultTransporter.sendMail(options, err => {
        if (err) {
          console.error(err)
        }
      })
    }
  }

  app.decorate('mail', mail)
  done()
})
