#!/usr/bin/env node

let fs = require('fs')
let generateConfig = require('../lib/generate-config')
let inquirer = require('inquirer')

const QUESTIONS = [
  {
    type: 'input',
    name: 'username',
    message: 'QuickBase username:'
  },
  {
    type: 'password',
    name: 'password',
    message: 'QuickBase password (leave blank to use the QUICKBASE_CLI_PASSWORD environment variable):'
  },
  {
    type: 'input',
    name: 'dbid',
    message: 'Main DBID for the QuickBase application:'
  },
  {
    type: 'input',
    name: 'realm',
    message: 'QuickBase realm:'
  },
  {
    type: 'input',
    name: 'appToken',
    message: 'QuickBase application token (if applicable):'
  },
  {
    type: 'input',
    name: 'appName',
    message: 'Code page prefix (leave blank to disable prefixing uploaded pages):'
  }
]

qbInit()

function qbInit() {
  inquirer.prompt(QUESTIONS).then(answers => {
    return generateConfig(answers)
  }).then(() => {
    console.log('quickbase-cli.config.js generated successfuly.')
  }).catch(err => {
    console.error(err)
  })
}
