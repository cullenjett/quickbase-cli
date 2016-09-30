# QuickBase CLI
[![npm version](https://badge.fury.io/js/quickbase-cli.svg)](https://badge.fury.io/js/quickbase-cli)

Simple command line tool for uploading local files to a QuickBase application.

### Installation
Requirements: [Node.js](https://nodejs.org/en/) >=4.x (?) and [Git](https://git-scm.com/).

```bash
npm install -g quickbase-cli
```

### Usage
There are three commands available for quickbase-cli:

#### qb new
```bash
qb new <github-repo> <project-name>

# example
qb new cullenjett/quickbase-template myAwesomeProject
```

This command will start a new application by cloning a Github repo from `<github-repo>` (formatted as "github username/repo name") and generate the project at `./<project-name>`. **Both `<github-repo>` and `<project-name>` are required.**

For now this is only a wrapper around `git clone`. After you pull down a repo you will need to run `qb init` if the app doesn't have a `quickbase-cli.config.js` file in it already.

#### qb init
```bash
qb init
```

Initialize an existing app with quickbase-cli functionality. Respond to the prompts to create a `quickbase-cli.config.js` file, which is later used during the `qb deploy` command. Run this command from the root of your application, as the file will be placed wherever the command is run.

#### qb deploy
```bash
qb deploy [options] <file path or directory>

# example
qb deploy -w dist/
```

This will upload the file(s) at `<file path or directory>` to the QuickBase application configured in the `quickbase-cli.config.js` file in the root of the application. There is one optional flag that can be passed, `-w` (or `--watch`) that will set up a watcher on `<file path or directory>` and deploy that file to QuickBase on change. **If no `<file path or directory>` is given then the current directory will be deployed.**

All html files will run through a regex to replace asset file includes (i.e. `<script src="bundle.js"></script>` and/or `<link href="bundle.css"/>`) with their new QuickBase urls. In addition, the `appName` from `quickbase-ci.config.js` will be prepended to all uploaded files.

### Notes

* Instead of exposing your password for the `quickbase-cli.config.js` file you can rely on an environment variable called `QUICKBASE_CLI_PASSWORD`. If you have that variable defined and leave the `password` empty when prompted the `qb deploy` command will use it instead. Always practice safe passwords.

* Moves are being made to add cool shit like global defaults, awesome starter templates, and pulling down existing code files from QuickBase. They're not out yet, so for now you're on your own.