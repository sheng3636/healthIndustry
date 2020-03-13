'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
    api: '"http://47.103.102.173:8881/MassiveHealthS/"' //本地接口请求前缀
})
