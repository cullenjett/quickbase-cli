#!/usr/bin/env node

let ApiClient = require('../lib/api')
let args = require('commander').parse(process.argv).args
let sourceArg = args[0]
let fs = require('fs')
let path = require('path')

let config = {
  username: 'cullenjett',
  realm: 'ais',
  dbid: 'bjzrx8ciy',
  appName: 'quickbase-cli'
}
let api = new ApiClient(config)

deploy(sourceArg)

function deploy(source='.') {
  let isFile = fs.statSync(source).isFile()

  if (isFile) {
    return uploadFileToQuickbase(source).then((res) => console.log(res))
  }

  if (!isFile) {
    let allFiles = fs.readdirSync(source)
    let htmlFiles = allFiles.filter(file => path.extname(file) == '.html').map(file => path.join(source, file))
    let assetFiles = allFiles.filter(file => path.extname(file) != '.html').map(file => path.join(source, file))

    let uploadHtmlFiles = htmlFiles.map(htmlFile => {
      let htmlContents = fs.readFileSync(htmlFile, 'utf-8')
      assetFiles.forEach(assetFile => {
        htmlContents = htmlContents.replace(new RegExp(assetFile, 'g'), generateCustomPageUrl(assetFile))
      })
      return uploadToQuickbase(htmlFile, htmlContents)
    })

    let uploadAssetFiles = assetFiles.map(assetFile => uploadToQuickbase(assetFile))

    let uploadAllFiles = [...uploadHtmlFiles, ...uploadAssetFiles]

    return Promise.all(uploadAllFiles).then((res) => console.log("DONE:", res))
  }
}

function uploadToQuickbase(file, fileContents) {
  let fileName = path.basename(file)

  if (!fileContents) {
    fileContents = fs.readFileSync(file, 'utf-8')
  }

  return api.uploadPage(`${config.appName}-${fileName}`, fileContents)
}

function generateCustomPageUrl(fileName) {
  return `https://${config.realm}.quickbase.com/db/${config.dbid}?a=dbpage&pagename=${config.appName}-${fileName}`
}