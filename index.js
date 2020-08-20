const {promisify} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const parse = require('json-parse-even-better-errors')
const _indent = Symbol.for('indent')
const rpj = path => readFile(path, 'utf8')
  .then(data => {
    // get the indentation so that we can save it back nicely
    // if the file starts with {" then we have an indent of '', ie, none
    // otherwise, pick the indentation of the next line after the first \n
    // JSON.stringify ignores symbols, so this is reasonably safe.
    const indent = data.match(/^\{\n?([\s\t]*)"/)
    const result = normalize(parse(data))
    result[_indent] = indent[1]
    return result
  })
  .catch(er => {
    er.path = path
    throw er
  })
const normalizePackageBin = require('npm-normalize-package-bin')

const normalize = data => {
  add_id(data)
  fixBundled(data)
  foldinOptionalDeps(data)
  fixScripts(data)
  fixFunding(data)
  normalizePackageBin(data)
  return data
}

rpj.normalize = normalize

const add_id = data => {
  if (data.name && data.version)
    data._id = `${data.name}@${data.version}`
  return data
}

const foldinOptionalDeps = data => {
  const od = data.optionalDependencies
  if (od && typeof od === 'object') {
    data.dependencies = data.dependencies || {}
    for (const [name, spec] of Object.entries(od)) {
      data.dependencies[name] = spec
    }
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
  else if (bd && typeof bd === 'object') {
    if (!Array.isArray(bd))
      data.bundleDependencies = Object.keys(bd)
    else
      data.bundleDependencies = bd
  } else
    delete data.bundleDependencies

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
