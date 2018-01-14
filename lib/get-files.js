const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

async function getFiles(source) {
  const files = {
    htmlFiles: [],
    assetFiles: []
  };

  await traverse(source, filePath => {
    if (path.extname(filePath) == '.html') {
      files.htmlFiles.push(filePath);
    } else if (path.basename(filePath) !== 'quickbase-cli.config.js') {
      files.assetFiles.push(filePath);
    }
  });

  return files;
}

async function traverse(currentDirPath, cb) {
  const files = await readdir(currentDirPath);

  return await Promise.all(
    files.map(async fileName => {
      const filePath = path.join(currentDirPath, fileName);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        cb(filePath);
        return Promise.resolve();
      } else {
        return traverse(filePath, cb);
      }
    })
  );
}

module.exports = {
  getFiles,
  traverse
};
