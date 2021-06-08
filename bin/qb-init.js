#!/usr/bin/env node

let fs = require('fs');
let generateConfig = require('../lib/generate-config');
let inquirer = require('inquirer');

const QUESTIONS = [
  {
    type: 'input',
    name: 'username',
    message: 'QuickBase username (leave blank to use the QUICKBASE_CLI_USERNAME environment variable):'
  },
  {
    type: 'password',
    name: 'password',
    message:
      'QuickBase password (leave blank to use the QUICKBASE_CLI_PASSWORD environment variable):'
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
    message: 'QuickBase application token (if applicable) (leave blank to use the QUICKBASE_CLI_APPTOKEN environment variable):'
  },
  {
    type: 'input',
    name: 'userToken',
    message: 'QuickBase user token (if applicable) (leave blank to use the QUICKBASE_CLI_USERTOKEN environment variable):'
  },
  {
    type: 'input',
    name: 'appName',
    message:
      'Code page prefix (leave blank to disable prefixing uploaded pages):'
  },
  {
    type: 'input',
    name: 'authenticate_hours',
    message:
      'Authentication expiry period in hours (default is 1):'
  }
];

qbInit();

function qbInit() {
  inquirer
    .prompt(QUESTIONS)
    .then(answers => {
      return generateConfig(answers);
    })
    .then(() => {
      console.log('quickbase-cli.config.js generated successfuly.');
    })
    .catch(err => {
      console.error(err);
    });
}
