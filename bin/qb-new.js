#!/usr/bin/env node

let args = require('commander').parse(process.argv).args
let template = args[0]
let projectName = args[1]

let gitClone = require('../lib/git-clone')

qbNew(template, projectName)

function qbNew(template, projectName) {
  if (!template.match("/")) {
    template = `AdvantageIntegratedSolutions/${template}`
  }

  gitClone(template, projectName).then(res => {
    console.log(`New project ${projectName || ''} created.`)
  }).catch(err => console.error(err))
}