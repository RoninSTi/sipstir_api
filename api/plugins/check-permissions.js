'use strict'

var fp = require('fastify-plugin')

function barsnapCheckPermissions(fastify, _, next) {
  fastify.decorateRequest('bsCheckPermissions', checkPermissions)

  next()

  function checkPermissions(permissions, callback) {
    var request = this

    if (callback === undefined) {
      return new Promise(function (resolve, reject) {
        request.bsCheckScope(permissions, function (err) {
          return err ? reject(err) : resolve(null)
        })
      })
    }

    if (permissions.length === 0) { return callback(new Error('Permissions cannot be empty')) }
    if (!this.user) { return callback(new Error('request.user does not exist')) }

    var userPermissions = this.user.permissions;

    var allowed = permissions.some(function (permission) {
      return userPermissions.indexOf(permission) !== -1
    })

    return callback(allowed ? null : new Error('Insufficient permission'))
  }
}

module.exports = fp(barsnapCheckPermissions, {
  fastify: '>=1.0.0-rc.1',
  name: 'fastify-jwt-authz'
})
