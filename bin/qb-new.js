#!/usr/bin/env node

let args = require('commander').parse(process.argv).args
let template = args[0]
let projectName = args[1]

qbNew(template, projectName)

function qbNew(template, projectName) {
  // clone repo
  // run qb init
}