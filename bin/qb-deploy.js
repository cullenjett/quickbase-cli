#!/usr/bin/env node

// TODO:
// confirm files w/user before uploading?

const fs = require('fs');
const path = require('path');
const program = require('commander');
const watch = require('chokidar').watch;
const util = require('util');

const ApiClient = require('../lib/api');
const { getFiles } = require('../lib/get-files');

const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);

program
  .option('-w, --watch', 'deploy files on change')
  .option(
    '-x --replace',
    'replace css and js file paths inside html file with their QuickBase url'
  )
  .parse(process.argv);

const sourceArg = program.args[0] || '.';
const configPath = require('../lib/find-config')(sourceArg);
const config = require(configPath);
const api = new ApiClient(config);

qbDeploy(sourceArg);

if (program.watch) {
  console.log(`Watching for file changes in ${sourceArg}`);

  watch(sourceArg, {}).on('change', fileName => {
    console.log(`\nChange detected in ${fileName}`);
    program.replace
      ? qbDeploy(sourceArg)
      : qbDeploy(fileName);
  });
}

async function qbDeploy(source) {
  console.log('Uploading files to QuickBase...');
  
  try {
    await api.authenticateIfNeeded();
  } catch(e) {
    console.error(e);
    return;
  }
  
  const stats = await fs.statSync(source);
  const isFile = stats.isFile();

  if (isFile) {
    return uploadToQuickbase(source)
      .then(res =>
        console.log(`Successfully uploaded to QuickBase:\n=> ${source}`)
      )
      .catch(err => console.error(err));
  }

  if (!isFile) {
    getFiles(source).then(files => {
      const uploadPromises = program.replace
        ? files.map(file => replaceUrlsAndUpload(file, files))
        : files.map(file => uploadToQuickbase(file));

      return Promise.all(uploadPromises)
        .then(res =>
          console.log(
            `Successfully uploaded to QuickBase:\n=> ${files.join('\n=> ')}`
          )
        )
        .catch(err => console.error(err));
    });
  }
}

function uploadToQuickbase(file, fileContents) {
  let fileName = path.basename(file);
  let codePageName;

  if (!fileContents) {
    fileContents = fs.readFileSync(file, 'utf-8');
  }

  if (config.appName) {
    codePageName = `${config.appName}-${fileName}`;
  } else {
    codePageName = fileName;
  }

  return api.uploadPage(codePageName, fileContents);
}

async function replaceUrlsAndUpload(file, allFiles) {
  let fileContents = await readFile(file, 'utf-8');

  allFiles.forEach(assetFile => {
    if (file !== assetFile) {
      const fileName = path.basename(assetFile);
      const regex = new RegExp(`("|')[^"]*${fileName}("|')`, 'g');

      fileContents = fileContents.replace(
        regex,
        generateCustomPageUrl(path.basename(assetFile))
      );
    }
  });

  return uploadToQuickbase(file, fileContents);
}

function generateCustomPageUrl(fileName) {
  const suffix = config.appName
    ? `${config.appName}-${fileName}`
    : `${fileName}`;

  return `"https://${config.realm}.quickbase.com/db/${
    config.dbid
  }?a=dbpage&pagename=${suffix}"`;
}
