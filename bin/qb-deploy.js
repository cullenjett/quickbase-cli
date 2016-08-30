#!/usr/bin/env node

let ApiClient = require('../lib/api')
let args = require('commander').parse(process.argv).args
let sourceDirectory = args[0]
let fs = require('fs')
let path = require('path')

let config = {
  username: 'cullenjett',
  realm: 'ais',
  dbid: 'bjzrx8ciy',
  appName: 'quickbase-cli'
}
let api = new ApiClient(config)

const parseFiles = (source) => {
  let fileNames = fs.readdirSync(source)

  let indexHtml = fileNames.find(fileName => path.extname(fileName) == '.html')
  let mainJs = fileNames.find(fileName => path.extname(fileName) == '.js')
  let mainCss = fileNames.find(fileName => path.extname(fileName) == '.css')

  let jsFileName = path.basename(mainJs)
  let cssFileName = path.basename(mainCss)

  return {indexHtml, jsFileName, cssFileName}
}

const generateCustomPageUrl = (fileName) => {
  return `https://${config.realm}.quickbase.com/db/${config.dbid}?a=dbpage&pagename=${config.appName}-${fileName}`
}

const deploy = (sourceDir) => {
  let isRelativePath = sourceDir.charAt(0) == '.'
  let source = null

  if (isRelativePath) {
    source = path.join(process.cwd(), sourceDir)
  } else {
    source = sourceDir
  }

  let {indexHtml, jsFileName, cssFileName} = parseFiles(source)
  let htmlText = fs.readFileSync(path.join(source, indexHtml), 'utf-8')
    .replace(new RegExp(jsFileName, 'g'), generateCustomPageUrl(jsFileName))
    .replace(new RegExp(cssFileName, 'g'), generateCustomPageUrl(cssFileName))

  let jsText = fs.readFileSync(path.join(source, jsFileName), 'utf-8')
  let cssText = fs.readFileSync(path.join(source, cssFileName), 'utf-8')

  let uploadAssets = []
  uploadAssets.push(api.uploadPage(htmlText, `${config.appName}-${indexHtml}`))
  uploadAssets.push(api.uploadPage(jsText, `${config.appName}-${jsFileName}`))
  uploadAssets.push(api.uploadPage(cssText, `${config.appName}-${cssFileName}`))

  return Promise.all(uploadAssets).then(res => {
    console.log("RES:", res)
  })
}

deploy(sourceDirectory)