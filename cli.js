#!/usr/bin/env node
const meow = require('meow')
const generate = require('.')

const help = `
  Usage
    $ tplgen <file> [--withDev] [--depOfdep]
  Options
    --withDev  Generate third party license file including dev dependencies
  Examples
    $ tplgen THIRD-PARTY-LICENSES.txt
    $ tplgen THIRD-PARTY-LICENSES.txt --withDev
    $ tplgen THIRD-PARTY-LICENSES.txt --depOfdep
`

const cli = meow(help, {
  flags: {
    withDev: {
      type: 'boolean'
    },
    depOfdep: {
      type: 'boolean'
    }
  }
})

generate(cli.input[0], cli.flags.withDev)
