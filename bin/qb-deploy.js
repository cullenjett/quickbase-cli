#!/usr/bin/env node

// TODO:
// confirm files w/user before uploading?

let ApiClient = require('../lib/api')
let fs = require('fs')
let path = require('path')
let program = require('commander')
let chokidar = require('chokidar')

program
  .option('-w, --watch', 'deploy files on change')
  .parse(process.argv)

let sourceArg = program.args[0] || '.'
let configPath = require('../lib/find-config')(sourceArg)
let config = require(configPath)
let api = new ApiClient(config)

qbDeploy(sourceArg)

if (program.watch) {
  chokidar.watch(sourceArg, {}).on('change', (fileName) => {
    console.log(`\nChange detected in ${fileName}. Deploying...`)
    qbDeploy(sourceArg)
  })
}

function qbDeploy(source) {
  let isFile = fs.statSync(source).isFile()

  if (isFile) {
    return uploadToQuickbase(source)
      .then(res => console.log(`Successfully uploaded to QuickBase:\n\t${source}`))
      .catch(err => console.error(err))
  }

  if (!isFile) {
    let allFiles = fs.readdirSync(source)
    let htmlFiles = allFiles.filter(file => path.extname(file) == '.html').map(file => path.join(source, file))
    let assetFiles = allFiles.filter(file => path.extname(file) != '.html').map(file => path.join(source, file))

    let uploadHtmlFiles = replaceUrlsAndUpload(htmlFiles, assetFiles)
    let uploadAssetFiles = assetFiles.map(assetFile => uploadToQuickbase(assetFile))
    let uploadAllFiles = uploadHtmlFiles.concat(uploadAssetFiles)

    return Promise.all(uploadAllFiles)
      .then(res => console.log(`Successfully uploaded to QuickBase:\n\t${allFiles.join("\n\t")}`))
      .catch(err => console.error(err))
  }
}

function generateCustomPageUrl(fileName) {
  return `https://${config.realm}.quickbase.com/db/${config.dbid}?a=dbpage&pagename=${config.appName}-${fileName}`
}

function replaceUrlsAndUpload(htmlFiles, assetFiles) {
  return htmlFiles.map(htmlFile => {
    let htmlContents = fs.readFileSync(htmlFile, 'utf-8')

    assetFiles.forEach(assetFile => {
      assetFile = path.basename(assetFile)

      htmlContents = htmlContents.replace(new RegExp(assetFile, 'g'), generateCustomPageUrl(assetFile))
    })

    return uploadToQuickbase(htmlFile, htmlContents)
  })
}

function uploadToQuickbase(file, fileContents) {
  let fileName = path.basename(file)
  let codePageName

  if (!fileContents) {
    fileContents = fs.readFileSync(file, 'utf-8')
  }

  if (config.appName) {
    codePageName = `${config.appName}-${fileName}`
  } else {
    codePageName = fileName
  }

  return api.uploadPage(codePageName, fileContents)
}