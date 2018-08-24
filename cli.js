#!/usr/bin/env node
const meow = require('meow')
const generate = require('.')

const help = `
  Usage
    $ tplgen <file> [--withDev]
  Options
    --withDev  Generate third party license file including dev dependencies
  Examples
    $ tplgen THIRD-PARTY-LICENSES.txt
    $ tplgen THIRD-PARTY-LICENSES.txt --withDev
`

const cli = meow(help, {
  flags: {
    withDev: {
      type: 'boolean'
    }
  }
})

generate(cli.input, cli.flags.withDev)
