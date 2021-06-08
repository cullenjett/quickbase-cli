const https = require('https');
const URL = require('url');


class ApiClient {
  
  constructor(config) {
    this.config = config;
    this.config.password = this.config.password || process.env.QUICKBASE_CLI_PASSWORD;
    this.config.username = this.config.username || process.env.QUICKBASE_CLI_USERNAME;
    this.config.appToken = this.config.appToken || process.env.QUICKBASE_CLI_APPTOKEN;
    this.config.userToken = this.config.userToken || process.env.QUICKBASE_CLI_USERTOKEN;
    this.authData = null;
  }


  uploadPage(pageName, pageText) {
    const xmlData = `
  <pagebody>${this._handleXMLChars(pageText)}</pagebody>
  <pagetype>1</pagetype>
  <pagename>${pageName}</pagename>
`;

    return new Promise((resolve, reject) => {

        this.sendQbRequest('API_AddReplaceDBPage', xmlData).then((response) => {
          resolve(response)
        }).catch((errorDesc, err) => {
          reject(errorDesc, err)
        });

    });
  }


  // Private-ish
  _handleXMLChars(string) {
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


  authenticateIfNeeded() {

    return new Promise((resolve, reject) => {

      //Decide here which type of authentication should be done
      if (this.config.userToken) {
        //Use usertoken
        this.authData = `<usertoken>${this.config.userToken}</usertoken>`;
        resolve()
      } else if (this.config.username && this.config.password) {
        //regenerate ticket first, then Use ticket

        const dbid = 'main';
        const action = "API_Authenticate";

        const url = URL.parse(
          `https://${this.config.realm}.quickbase.com/db/${dbid}?a=${action}`
        );

        const options = {
          hostname: url.hostname,
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/xml',
            'QUICKBASE-ACTION': action
          }
        };

        const postData = `
<qdbapi>
  <username>${this.config.username}</username>
  <password>${this.config.password}</password>
  <hours>${this.config.authenticate_hours}</hours>
</qdbapi>`;

        const req = https.request(options, res => {
          let response = '';

          res.setEncoding('utf8');
          res.on('data', chunk => (response += chunk));
          res.on('end', () => {
            const errCode = +response.match(/<errcode>(.*)<\/errcode>/)[1];

            if (errCode != 0) {
              const errtext = response.match(/<errtext>(.*)<\/errtext>/)[1];
              reject(errtext);
            } else {
              const ticket = response.match(/<ticket>(.*)<\/ticket>/)[1];

              this.authData = `<ticket>${ticket}</ticket>`;
              if (this.config.appToken) {
                this.authData += `<apptoken>${this.config.appToken}</apptoken>`;
              }

              //Suggest to use ticket now, just validated
              resolve();
            }
          });
        });

        req.on('error', err => reject('Could not send Authentication request', err));
        req.write(postData);
        req.end();
  
      } else {
        //Error: not enough auth credentials
        reject("There are not enough authentication credentials in the config or environment. Please setup a valid username and password.")
      }
    });
  };


  async sendQbRequest(action, data, mainAPICall) {
      
    const dbid = mainAPICall ? 'main' : this.config.dbid;
    const url = URL.parse(
      `https://${this.config.realm}.quickbase.com/db/${dbid}?a=${action}`
    );

    if (!this.authData) {
      reject("You must call `authenticateIfNeeded()` before calling `sendQbRequest`");
      return;
    }

    return new Promise((resolve, reject) => {
      
      const postData = `
<qdbapi>
  ${this.authData}
  ${data}
</qdbapi>`;
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'QUICKBASE-ACTION': action
        }
      };
      
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
