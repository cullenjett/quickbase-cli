#!/usr/bin/env node

const nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);

if (nodeVersion < 8) {
  console.log(
    `*** quickbase-cli > 2.0 requires Node.js version >= 8. Please upgrade. ***`
  );

  process.exit(1);
}

require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('new [repo] [projectName]', 'generate a new project from a template')
  .command('init', 'add quickbase-cli functionality to an existing project')
  .command('deploy [path]', 'upload a project to quickbase')
  .parse(process.argv);
