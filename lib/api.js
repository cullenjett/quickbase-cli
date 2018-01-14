const https = require('https');
const URL = require('url');

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

    return string.replace(/[<>&'"]/g, char => {
      switch (char) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        case '"':
          return '&quot;';
      }
    });
  }

  sendQbRequest(action, data, mainAPICall) {
    const dbid = mainAPICall ? 'main' : this.config.dbid;
    const url = URL.parse(
      `https://${this.config.realm}.quickbase.com/db/${dbid}?a=${action}`
    );
    const postData = `
      <qdbapi>
        <username>${this.config.username}</username>
        <password>${this.config.password}</password>
        <hours>1</hours>
        <apptoken>${this.config.appToken}</apptoken>
        ${data}
      </qdbapi>
    `;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'QUICKBASE-ACTION': action
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let response = '';
        res.setEncoding('utf8');
        res.on('data', chunk => (response += chunk));
        res.on('end', () => {
          const errCode = +response.match(/<errcode>(.*)<\/errcode>/)[1];

          if (errCode != 0) {
            reject(response);
          } else {
            resolve(response);
          }

          resolve(response);
        });
      });

      req.on('error', err => reject('ERROR:', err));
      req.write(postData);
      req.end();
    });
  }
}

module.exports = ApiClient;
