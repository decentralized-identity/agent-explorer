#!/usr/bin/env node

const express = require('express')
const favicon = require('express-favicon')
const commander = require('commander')
const path = require('path')

commander
  .command('serve')
  .description('Launch agent explorer dashboard')
  .option('-p, --port <number>', 'Set port to serve on')
  .action(async (cmd) => {
    const PORT = process.env.PORT || cmd.port || 5000
    const app = express()

    app.use(favicon(path.join(__dirname, '../build', 'favicon.ico')))
    app.use(express.static(path.join(__dirname, '../build')))

    app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../build', 'index.html'))
    })

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
  })

if (!process.argv.slice(2).length) {
  commander.outputHelp()
} else {
  commander.parse(process.argv)
}
