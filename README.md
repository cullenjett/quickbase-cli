# QuickBase CLI (IN DEVELOPMENT)

Simple command line tool for uploading local files to a QuickBase application.

### Installation
Requirements: [Node.js](https://nodejs.org/en/) >=4.x and [Git](https://git-scm.com/).

```bash
npm install -g quickbase-cli
```

### Usage

#### qb new
```bash
qb new <github-template> <project-name>
```

This command will start a new application by cloning a Github repo from `<github-template>`, prompt for some information about the destination QuickBase application, and generate the project at `./<project-name>`.

#### qb init
```bash
qb init
```

Initialize an existing app with quickbase-cli functionality. Respond to the prompts to create a `quickbase-cli.config.js` file, which is later used during `qb deploy`. Run this command from the root of your application.

#### qb deploy
```bash
qb deploy <file path or directory>
```

This will upload the file(s) at `<file path or directory>` to the QuickBase application configured in the `quickbase-cli.config.js` file in the root of the application. All html files will run through a regex to replace asset file includes (ie `<script src="bundle.js"></script>` and/or `<link href="bundle.css"/>`) with their new QuickBase urls. In addition, the `appName` from `quickbase-ci.config.js` will be prepended to all uploaded files.