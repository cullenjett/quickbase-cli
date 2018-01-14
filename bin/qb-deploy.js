#!/usr/bin/env node

// TODO:
// confirm files w/user before uploading?

const fs = require('fs');
const path = require('path');
const program = require('commander');
const watch = require('chokidar').watch;

const ApiClient = require('../lib/api');
const { getFiles } = require('../lib/get-files');

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
    console.log(`\nChange detected in ${fileName}. Deploying...`);
    qbDeploy(fileName);
  });
}

function qbDeploy(source) {
  let isFile = fs.statSync(source).isFile();

  if (isFile) {
    return uploadToQuickbase(source)
      .then(res =>
        console.log(`Successfully uploaded to QuickBase:\n=> ${source}`)
      )
      .catch(err => console.error(err));
  }

  if (!isFile) {
    getFiles(source).then(files => {
      const { htmlFiles, assetFiles } = files;

      const uploadHtmlFiles = program.replace
        ? replaceUrlsAndUpload(htmlFiles, assetFiles)
        : htmlFiles.map(htmlFile => uploadToQuickbase(htmlFile));

      const uploadAssetFiles = assetFiles.map(assetFile =>
        uploadToQuickbase(assetFile)
      );

      const uploadAllFiles = uploadHtmlFiles.concat(uploadAssetFiles);

      return Promise.all(uploadAllFiles)
        .then(res =>
          console.log(
            `Successfully uploaded to QuickBase:\n=> ${htmlFiles
              .concat(assetFiles)
              .join('\n=> ')}`
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

function replaceUrlsAndUpload(htmlFiles, assetFiles) {
  return htmlFiles.map(htmlFile => {
    let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

    assetFiles.forEach(assetFile => {
      const fileName = path.basename(assetFile);
      const regex = new RegExp(`("|')[^"]*${fileName}("|')`, 'g');

      htmlContent = htmlContent.replace(
        regex,
        generateCustomPageUrl(path.basename(assetFile))
      );
    });

    console.log(htmlContent);
    return uploadToQuickbase(htmlFile, htmlContent);
  });
}

function generateCustomPageUrl(fileName) {
  const suffix = config.appName
    ? `${config.appName}-${fileName}`
    : `${fileName}`;

  return `"https://${config.realm}.quickbase.com/db/${
    config.dbid
  }?a=dbpage&pagename=${suffix}"`;
}
