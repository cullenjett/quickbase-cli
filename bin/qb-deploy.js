#!/usr/bin/env node

let args = require('commander').parse(process.argv).args

console.log(`you called 'qb deploy' with the following args: ${args}`)