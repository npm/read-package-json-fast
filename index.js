const {promisify} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const parse = require('json-parse-even-better-errors')
const rpj = path => readFile(path, 'utf8')
  .then(data => parse(data))
  .then(fixBundled)
  .then(fixScripts)
  .then(fixFunding)
  .then(fixBin)
  .catch(er => {
    er.path = path
    throw er
  })

const fixBin = data => {
  if (typeof data.bin === 'string') {
    if (data.name)
      data.bin = { [data.name]: data.bin }
    else
      delete data.bin
  } else if (typeof data.bin !== 'object' || !data.bin)
    delete data.bin
  else
    for (const [name, bin] of Object.entries(data.bin)) {
      if (typeof bin !== 'string')
        delete data.bin[name]
    }
  return data
}

const fixBundled = data => {
  const bdd = data.bundledDependencies
  const bd = data.bundleDependencies === undefined ? bdd
    : data.bundleDependencies

  if (bd === false)
    data.bundleDependencies = []
  else if (bd === true)
    data.bundleDependencies = Object.keys(data.dependencies || {})
  else if (bd && typeof bd === 'object')
    data.bundleDependencies = Object.keys(bd)
  delete data.bundledDependencies
  return data
}

const fixScripts = data => {
  if (!data.scripts || typeof data.scripts !== 'object') {
    delete data.scripts
    return data
  }

  for (const [name, script] of Object.entries(data.scripts)) {
    if (typeof script !== 'string')
      delete data.scripts[name]
  }
  return data
}

const fixFunding = data => {
  if (data.funding && typeof data.funding === 'string')
    data.funding = { url: data.funding }
  return data
}

module.exports = rpj
