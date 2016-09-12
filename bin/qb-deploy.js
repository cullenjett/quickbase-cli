#!/usr/bin/env node

let ApiClient = require('../lib/api')
let args = require('commander').parse(process.argv).args
let fs = require('fs')
let path = require('path')
let sourceArg = args[0] || '.'

let configPath = require('../lib/find-config')(sourceArg)
let config = require(configPath)

let api = new ApiClient(config)

qbDeploy(sourceArg)

function qbDeploy(source='.') {
  let isFile = fs.statSync(source).isFile()

  if (isFile) {
    return uploadToQuickbase(source)
      .then(res => console.log("Successfully uploaded to QuickBase"))
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
      .then(res => console.log("Successfully uploaded to QuickBase"))
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

  if (!fileContents) {
    fileContents = fs.readFileSync(file, 'utf-8')
  }

  return api.uploadPage(`${config.appName}-${fileName}`, fileContents)
}