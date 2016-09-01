# QuickBase CLI

Simple command line tool for uploading local files to a QuickBase application.

### Installation
Requirements: [Node.js](https://nodejs.org/en/) >=4.x and [Git](https://git-scm.com/).

```bash
npm install -g quickbase-cli
```

### Usage

```bash
qb deploy <directory>
```

This will upload the files inside <directory> to the QuickBase application configured in the `.quickbase-cli` file at the root of the application.