#!/usr/bin/env node

// TODO: This needs to do something other than call 'git clone'...
// rm -rf .git/
// prompt user if no quickbase-cli.config.js file is found
// default github username

let args = require('commander').parse(process.argv).args
let gitClone = require('../lib/git-clone')

let template = args[0]
let projectName = args[1]

if (!template) {
  console.error('template required')
  process.exit(1)
}

qbNew(template, projectName)

function qbNew(template, projectName) {
  gitClone(template, projectName).then(res => {
    console.log(`New project created.`)
  }).catch(err => console.error(err))
}