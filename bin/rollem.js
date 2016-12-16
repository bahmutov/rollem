#!/usr/bin/env node

'use strict'

const fs = require('fs')
const join = require('path').join
const argv = require('minimist')(process.argv.slice(2))

const configFilename = (argv.c === true) ? 'rollem.config.js' : argv.c;

const configName = join(process.cwd(), configFilename)
if (!fs.existsSync(configName)) {
  console.error('Cannot find', configName)
  process.exit(-1)
}

const rollup = require('rollup')
const rollem = require(join(__dirname, '..'))

function isWatchArgument (arg) {
  return arg === '-w' || arg === '--watch'
}
const isWatching = process.argv.some(isWatchArgument)
const options = {
  watch: isWatching
}

rollup.rollup({
  entry: configFilename
}).then(function (bundle) {
  const {code} = bundle.generate({
    format: 'cjs'
  })
  const config = eval(code) // eslint-disable-line no-eval

  rollem(config, options)
    .catch((err) => {
      console.error('Problem rolling them')
      console.error(err.message)
      console.error(err.stack)
      process.exit(-1)
    })
}).catch(console.error)
