# QuickBase CLI (IN DEVELOPMENT)

Simple command line tool for uploading local files to a QuickBase application.

### Installation
Requirements: [Node.js](https://nodejs.org/en/) >=4.x and [Git](https://git-scm.com/).

```bash
npm install -g quickbase-cli
```

### Usage

#### qb new
#### qb init
#### qb deploy

```bash
qb deploy <file path or directory>
```

This will upload the file(s) at <file path or directory> to the QuickBase application configured in the `quickbase-cli.config.js` file in the root of the application. All html files will run through a regex to replace asset file includes (ie `<script src="bundle.js"></script>` and/or `<link href="bundle.css"/>`) with their new QuickBase urls. In addition, the `appName` from `quickbase-ci.config.js` will be prepended to all uploaded files.