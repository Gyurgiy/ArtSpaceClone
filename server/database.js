import fastifyPlugin from 'fastify-plugin'
import * as sequelize from 'sequelize'


// @ts-ignore
class BasicModel extends sequelize.Model {

  static id = {
    type: sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }

  static uuid = {
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    unique: 'iu_basic_uuid'
  }

  static serialize(attributes = {}) {
    /** @type {typeof BasicModel} */// @ts-ignore
    const proto = Reflect.getPrototypeOf(this)

    if ('serialize' in proto) {
      proto.serialize(attributes)
    }

    for (const [name, attr] of Object.entries(this)) {
      if (name && typeof name === 'string' && attr && typeof attr === 'object' && 'type' in attr) {
        attributes[name] = attr
      }
    }

    return attributes
  }

  static init(sequelize) {
    const attributes = this.serialize()
    const options = { sequelize }

    // @ts-ignore
    return super.init(attributes, options)
  }

}


class User extends BasicModel {

  static login = {
    type: sequelize.STRING(256),
    unique: 'iu_login',
    allowNull: true,
    validate: {
      notEmpty: true
    }
  }

  static email = {
    type: sequelize.STRING(256),
    unique: 'iu_email',
    allowNull: false,
    validate: {
      isEmail: true,
      notNull: true,
      notEmpty: true
    }
  }

  static fullName = {
    type: sequelize.STRING(256),
    allowNull: false,
    validate: {
      notEmpty: true,
      notNull: true
    }
  }

}


async function initialData(app) {
  /** @type {{User:import('sequelize').ModelStatic<User>}} */
  const { User } = app.db

  await User.findCreateFind({
    where: { email: 'maildrakon@gmail.com' },
    defaults: { fullName: 'IgorNovozhilov' }
  })
}


export default fastifyPlugin(async function routes(/** @type {any} */ app) {
  const db = new sequelize.Sequelize(app.env.connectionString, {
    logging: app.env.debugMode ? console.log : false
  })

  app.decorate('db', {
    User: User.init(db)
  })

  await db.sync({
    alter: true,
    logging: app.env.debugMode ? console.log : false
  })

  await initialData(app)
})
