let fs = require('fs');

let template = `module.exports = {
  username: "{{username}}",
  password: "{{password}}",
  realm: "{{realm}}",
  dbid: "{{dbid}}",
  appToken: "{{appToken}}",
  userToken: "{{userToken}}",
  appName: "{{appName}}",
  authenticate_hours: "{{authenticate_hours}}",
}`;

const generateConfig = answers => {
  return new Promise((resolve, reject) => {
    for (let i in answers) {
      if (i == 'password' && answers[i] == '') {
        template = template.replace(
          /password: \"\{\{password\}\}\",/,
          `//leave commented out to use QUICKBASE_CLI_PASSWORD env variable\n\t//password:`
        );
      } else if (i == 'username' && answers[i] == '') {
        template = template.replace(
          /username: \"\{\{username\}\}\",/,
          `//leave commented out to use QUICKBASE_CLI_USERNAME env variable\n\t//username:`
        );
      } else if (i == 'appToken' && answers[i] == '') {
        template = template.replace(
          /appToken: \"\{\{appToken\}\}\",/,
          `//leave commented out to use QUICKBASE_CLI_APPTOKEN env variable\n\t//appToken:`
        );
      } else if (i == 'userToken' && answers[i] == '') {
        template = template.replace(
          /userToken: \"\{\{userToken\}\}\",/,
          `//leave commented out to use QUICKBASE_CLI_USERTOKEN env variable\n\t//userToken:`
        );
      } else if (i == 'authenticate_hours' && answers[i] == '') {
		const authenticate_hours = parseInt(answers[i]) || 1
        template = template.replace(
          /authenticate_hours: \"\{\{authenticate_hours\}\}\",/, 'authenticate_hours: "'+authenticate_hours+'"'
        );
      } else {
        template = template.replace(new RegExp(`{{${i}}}`, 'g'), answers[i]);
      }
    }

    console.log(template);

    fs.writeFile('./quickbase-cli.config.js', template, err => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

module.exports = generateConfig;
