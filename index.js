#!/usr/bin/env node

const rollup = require('rollup')
const { babel } = require('@rollup/plugin-babel')
const { resolve } = require('path')
const { white, red, green } = require('kleur')
const { logcons } = require('logcons')
const { existsSync } = require('fs')

const important = white().bold
const success = green().bold

const inputOptions = {
  plugins: [
    babel({
      babelHelpers: 'bundled'
    })
  ]
}

const outputOptions = {
  format: 'cjs'
}

function errorHandler (err) {
  const msg = (err.message || err || 'Unknown error').replace(
    /(\r?\n)/g,
    '$1      '
  )
  console.error(`${logcons.cross()} ${red().bold('wrap ')}${msg}`)
  process.exit(1)
}

async function main () {
  try {
    const pkgfile = resolve('package.json')
    const pkg = existsSync(pkgfile) && require(pkgfile)

    if (!pkg) {
      throw new Error(
        `'package' not found, add a ${important(
          'package.json'
        )} to your project`
      )
    }

    const entry = pkg.source
    const main = pkg.main
    if (!entry) {
      throw new Error(
        `'package.source' not found, add a ${important(
          'source'
        )} field to your package.json`
      )
    }
    if (!main) {
      throw new Error(
        `'package.main' not found, add a ${important(
          'main'
        )} field to your package.json`
      )
    }

    const _inputOptions = { ...inputOptions, input: entry }

    const _outputOptions = {
      ...outputOptions,
      file: main,
      banner: pkg.bin ? '#!/usr/bin/env node\n' : null
    }

    if (pkg.exports) {
      if (typeof pkg.exports !== 'string') {
        throw new Error(
          'doesn\'t support a map of exports yet, please use a string to the entry file of the esm instead'
        )
      }

      const esmOutputOptions = {
        ...outputOptions,
        file: pkg.exports,
        format: 'esm'
      }

      await writeBundle(_inputOptions, esmOutputOptions)
    }

    await writeBundle(_inputOptions, _outputOptions)

    console.log(
      `${logcons.info()} Output written to ${important(_outputOptions.file)}`
    )
    console.log(`${logcons.tick()} ${success('Done')}`)
  } catch (err) {
    errorHandler(err)
  }
}

async function writeBundle (_inputOptions, _outputOptions) {
  const bundle = await rollup.rollup(_inputOptions)
  await bundle.generate(_outputOptions)
  await bundle.write(_outputOptions)
  await bundle.close()
}

main()
