let env = process.env.NODE_ENV || 'development'
//console.log('env ******', env)

if (env === 'development' || env === 'test') {
  //requiring json it will auto be a js obj - not parse needed console.log(config)
  var config = require('./config.json')
  var envConfig = config[env]

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}
