# QuickBase CLI
[![npm version](https://badge.fury.io/js/quickbase-cli.svg)](https://badge.fury.io/js/quickbase-cli)

Writing custom code inside QuickBase sucks. Copy/pasting from your editor sucks. This simple command line tool lets you easily upload your local code files to a QuickBase application so you don't have to do either of those.

## Installation
Requirements: [Node.js](https://nodejs.org/en/) >= 8

```bash
npm install -g quickbase-cli
```

## Usage
quickbase-cli can be used for basic QuickBase code page development. It's probably possible to use quickbase-cli with modern SPA cli tools (angular cli, create-react-app, vue cli, etc.), but I haven't actually tried it so let me know how it goes.

There are three commands available for quickbase-cli:
- qb init
- qb deploy
- qb new

### qb init
```bash
qb init
```
**This is required in order to use the `qb deploy` command.**

Initialize an existing app with quickbase-cli functionality. Respond to the prompts to create a config file called  `quickbase-cli.config.js` which is used by other quickbase-cli commands. Run `qb init` from the root of your application, as the config file will be placed wherever the command is run.

Below are the prompts (see the [Notes](#notes) below for an important advisory re: entering your QuickBase password when prompted):

```javascript
{
  name: 'username',
  message: 'QuickBase username (leave blank to use the QUICKBASE_CLI_USERNAME environment variable):'
},
{
  name: 'password',
  message: 'QuickBase password (leave blank to use the QUICKBASE_CLI_PASSWORD environment variable):'
},
{
  name: 'dbid',
  message: 'Main DBID for the QuickBase application:'
},
{
  name: 'realm',
  message: 'QuickBase realm:'
},
{
  name: 'appToken',
  message: 'QuickBase application token (if applicable) (leave blank to use the QUICKBASE_CLI_APPTOKEN environment variable):'
},
{
  name: 'userToken',
  message: 'QuickBase user token (if applicable) (leave blank to use the QUICKBASE_CLI_USERTOKEN environment variable):'
},
{
  name: 'appName',
  message: 'Code page prefix (leave blank to disable prefixing uploaded pages):'
},
{
  name: 'ticketExpiryHours',
  message: 'Ticket expiry period in hours (default is 1):'
}
```

### qb deploy
```bash
qb deploy [options] <file path or directory>

# examples
qb deploy -w app/index.js
qb deploy -x dist/
qb deploy -wx build/bundle.js
```

This will upload the file(s) at `<file path or directory>` to the QuickBase application configured in `quickbase-cli.config.js`. In addition, the value for `appName` in `quickbase-ci.config.js` will be prepended to all uploaded files (ex: if  `appName='demo'` then 'demo-bundle.js', 'demo-index.html', and 'demo-bundle.css' might be example output file names). If you don't want to prepend anything to your uploaded files leave this field empty.

**If no `<file path or directory>` is given then the current directory will be deployed.**

**THAT WAS AN IMPORTANT FACT, PAY ATTENTION WHEN RUNNING `qb deploy` -- DON'T UPLOAD YOUR NODE_MODULES DIRECTORY TO QUICKBASE...**

There are two optional flags that can be passed to `qb deploy`. You can use them individually or multiple at a time:
- `-w` (or `--watch`): watch for changes to `<file path or directory>` and deploy to QuickBase on change. After the initial deploy only the file that changes will be uploaded to QuickBase unless the `-x` flag is also passed, in which case the entire `<file path or directory>` source will be uploaded.
- `-x` (or `--replace`): If you pass a directory to `qb deploy` then all files will run through a regex to replace asset file includes (i.e. `<script src="bundle.js"></script>`, `<link href="bundle.css"/>`, etc.) with their new QuickBase urls (`<script src="realm.quickbase.com/db/dbayemay?a=dbpage&pageID=123"></script>`). This is in no way an optimized command, so I'd avoid running it on YUGE directories.

### qb new (mostly useless)
```bash
qb new <github-repo> <project-name>

# example
qb new cullenjett/quickbase-template myAwesomeProject
```

This command will start a new application by cloning a Github repo from `<github-repo>` (formatted as "github username/repo name") and generate the project at `./<project-name>`. **Both `<github-repo>` and `<project-name>` are required.**

For now this is only a wrapper around `git clone`. After you pull down a repo you will need to run `qb init` if the app doesn't have a `quickbase-cli.config.js` file in it already. The end goal is to have starter-template repos available for quick and easy kick off.


## Notes

* Instead of exposing your password for the `quickbase-cli.config.js` file you can rely on an environment variable called `QUICKBASE_CLI_PASSWORD`. If you have that variable defined and leave the `password` empty when prompted the `qb deploy` command will use it instead. Always practice safe passwords.

* The same can also be done with username (using `QUICKBASE_CLI_USERNAME`), user token (using `QUICKBASE_CLI_USERTOKEN`) and/or app token (using `QUICKBASE_CLI_APPTOKEN`).

* ~~Moves are being made to add cool shit like a build process, global defaults, awesome starter templates, and pulling down existing code files from QuickBase. They're not out yet, so for now you're on your own.~~

* I no longer work with QuickBase applications, so the cool shit I had planned won't happen unless someone submits some dope pull requests.
