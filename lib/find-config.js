let fs = require('fs')
let path = require('path')

const CONFIG_FILE_NAME = 'quickbase-cli.config.js'

const findConfig = (source) => {
  source = path.resolve(source)

  let isFile = fs.statSync(source).isFile()

  let children
  if (isFile) {
    children = fs.readdirSync(path.join(source, '..'))
  } else {
    children = fs.readdirSync(source)
  }

  let configFile = children.find(file => file == CONFIG_FILE_NAME)

  if (configFile) {
    return path.join(source, CONFIG_FILE_NAME)
  } else {
    return findConfig(path.join(source, '..'))
  }
}

module.exports = findConfig