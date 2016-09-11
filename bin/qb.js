#!/usr/bin/env node

require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('new <repo> [projectName]', 'generate a new project from a template')
  .command('init', 'add quickbase-cli functionality to an existing project')
  .command('deploy [path]', 'upload a project to quickbase')
  .parse(process.argv)