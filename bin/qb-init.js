#!/usr/bin/env node

// TODO: application token
// better question text

let fs = require('fs')
let generateConfig = require('../lib/generate-config')
let inquirer = require('inquirer')

const QUESTIONS = [
  {
    type: 'input',
    name: 'username',
    message: 'What is your QuickBase username?'
  },
  {
    type: 'password',
    name: 'password',
    message: 'What is your QuickBase password? Leave blank to use the QUICKBASE_CLI_PASSWORD env variable.'
  },
  {
    type: 'input',
    name: 'dbid',
    message: 'What is the main DBID for the QuickBase application?'
  },
  {
    type: 'input',
    name: 'realm',
    message: 'What is the QuickBase realm?'
  },
  {
    type: 'input',
    name: 'appName',
    message: 'What would you like to call this app?'
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