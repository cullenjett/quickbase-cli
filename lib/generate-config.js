let fs = require('fs')

let template = `module.exports = {
  username: "{{username}}",
  password: "{{password}}",
  realm: "{{realm}}",
  dbid: "{{dbid}}",
  appToken: "{{appToken}}",
  appName: "{{appName}}"
}`

const generateConfig = (answers) => {
  return new Promise((resolve, reject) => {
    for(let i in answers) {

      if (i == 'password' && answers[i] == "") {
        template = template.replace(/password: \"\{\{password\}\}\",/, `//password: QUICKBASE_CLI_PASSWORD`)
      } else {
        template = template.replace(new RegExp(`{{${i}}}`, 'g'), answers[i])
      }
    }

    console.log(template)

    fs.writeFile('./quickbase-cli.config.js', template, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(err)
      }
    })
  })
}

module.exports = generateConfig