let request = require('request')

class ApiClient {
  constructor(config) {
    this.config = config

    let password = process.env.QUICKBASE_CLI_PASSWORD
    this.config.password = this.config.password || password
  }

  uploadPage(pageName, pageText) {
    let xmlData = `
      <pagebody>${this.handleXMLChars(pageText)}</pagebody>
      <pagetype>1</pagetype>
      <pagename>${pageName}</pagename>
    `

    return this.sendQbRequest('API_AddReplaceDBPage', xmlData)
    // return Promise.resolve(pageName)
  }

  // Private-ish
  handleXMLChars(string) {
    if (!string) {
      return
    }

    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  sendQbRequest(action, data, mainAPICall) {
    let dbid = mainAPICall ? "main" : this.config.dbid
    let url = `https://${this.config.realm}.quickbase.com/db/${dbid}?a=${action}`

    data = `
      <qdbapi>
        <username>${this.config.username}</username>
        <password>${this.config.password}</password>
        <hours>1</hours>
        <apptoken>${this.config.token}</apptoken>
        ${data}
      </qdbapi>
    `

    return new Promise((resolve, reject) => {
      request({
        url: url,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/xml',
          'QUICKBASE-ACTION': action
        }
      }, (err, res, body) => {
        if (err) reject("ERROR:", err)
        resolve(body)
      })
    })
  }
}

module.exports = ApiClient;