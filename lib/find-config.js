const fs = require('fs');
const path = require('path');

const CONFIG_FILE_NAME = 'quickbase-cli.config.js';

const findConfig = (source, count = 1) => {
  if (count > 10) {
    console.log(
      'Couldn\'t find a "quickbase-cli.config.js" file. Make sure you\'ve run "qb init" in the root of your app.'
    );
    process.exit(1);
  }

  source = path.resolve(source);

  const isFile = fs.statSync(source).isFile();
  let children, parentDir;

  if (isFile) {
    parentDir = path.join(source, '..');
    children = fs.readdirSync(parentDir);
  } else {
    parentDir = source;
    children = fs.readdirSync(source);
  }

  const configFile = children.find(file => file == CONFIG_FILE_NAME);

  if (configFile) {
    return path.join(parentDir, CONFIG_FILE_NAME);
  } else {
    return findConfig(path.join(source, '..'), count + 1);
  }
};

module.exports = findConfig;
