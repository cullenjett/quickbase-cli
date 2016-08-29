#!/usr/bin/env node

let ApiClient = require('../lib/api')
let args = require('commander').parse(process.argv).args
let fs = require('fs')
let path = require('path')

let sourceDirectory = args[0]
let config = {
  username: 'cullenjett',
  realm: 'ais',
  dbid: 'bjzrx8ciy'
}
let api = new ApiClient(config)

const deploy = (sourceDir) => {
  let isRelativePath = sourceDir.charAt(0) == '.'
  let source

  if (isRelativePath) {
    source = path.join(process.cwd(), sourceDir)
  } else {
    source = sourceDir
  }

  let fileNames = fs.readdirSync(source)

  let indexHtml = fileNames.find(fileName => path.extname(fileName) == '.html')
  let mainJs = fileNames.find(fileName => path.extname(fileName) == '.js')
  let mainCss = fileNames.find(fileName => path.extname(fileName) == '.css')

  let jsFileName = path.basename(mainJs)
  let cssFileName = path.basename(mainCss)

  let htmlText = fs.readFileSync(path.join(sourceDir, indexHtml), 'utf-8')
    .replace(new RegExp(jsFileName, 'g'), 'SUCCESS.JS')
    .replace(new RegExp(cssFileName, 'g'), 'SUCCESS.CSS')

  let pageName = 'quickbase-cli.html'
  return api.uploadPage(htmlText, pageName).then(res => {
    console.log('RES:', res)
    console.log("DONE")
  })
}

deploy(sourceDirectory)