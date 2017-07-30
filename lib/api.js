const request = require('request');

class ApiClient {
  constructor(config) {
    this.config = config;

    const password = process.env.QUICKBASE_CLI_PASSWORD;
    this.config.password = this.config.password || password;
  }

  uploadPage(pageName, pageText) {
    const xmlData = `
      <pagebody>${this.handleXMLChars(pageText)}</pagebody>
      <pagetype>1</pagetype>
      <pagename>${pageName}</pagename>
    `;

    return this.sendQbRequest('API_AddReplaceDBPage', xmlData);
  }

  // Private-ish
  handleXMLChars(string) {
    if (!string) {
      return;
    }

    return string.replace(/[<>&'"]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
   });
  }

  sendQbRequest(action, data, mainAPICall) {
    const dbid = mainAPICall ? "main" : this.config.dbid;
    const url = `https://${this.config.realm}.quickbase.com/db/${dbid}?a=${action}`;

    data = `
      <qdbapi>
        <username>${this.config.username}</username>
        <password>${this.config.password}</password>
        <hours>1</hours>
        <apptoken>${this.config.appToken}</apptoken>
        ${data}
      </qdbapi>
    `;

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
        if (err) reject("ERROR:", err);

        const errCode = +body.match(/<errcode>(.*)<\/errcode>/)[1];
        if (errCode != 0) {
          reject(body);
        } else {
          resolve(body);
        }
      });
    });
  }
}

module.exports = ApiClient;
