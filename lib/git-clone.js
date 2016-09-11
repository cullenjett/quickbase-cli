let exec = require('child_process').exec
let spawn = require('child_process').spawn

const gitClone = (repo, projectName) => {
  let githubUsername = repo.split("/")[0]
  let repoName = repo.split("/")[1]
  let url = `git@github.com:${githubUsername}/${repoName}.git`

  let command = `git clone ${url}`

  if (projectName) command += ` ${projectName}`

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = gitClone