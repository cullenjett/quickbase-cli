#!/usr/bin/env node

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