import { white, green } from 'kleur'
import { logcons } from 'logcons'
import { checkAndInstall } from './check-and-install'
import { errorHandler } from './error-handler'
import { resolvePackage } from './resolve-pkg'

const bullet = white().bold
const success = green().bold

const inputOptions = {
  plugins: [],
  external: []
}

const outputOptions = {
  format: 'cjs'
}

const bubleDefaultOptions = {
  transforms: {
    asyncAwait: false,
    forOf: false
  },
  objectAssign: 'Object.assign'
}

export const bundler = async () => {
  try {
    const pkg = resolvePackage()

    const { source, main, module } = pkg

    const isMissingBaseFields = !(main && source)

    if (isMissingBaseFields) {
      throw new Error(
        `'package.source' or 'package.main' not found, add ${bullet(
          'source and main'
        )} fields to your package.json`
      )
    }

    const externalFromPackage = (pkg.wrap && pkg.wrap.external) || []

    const _inputOptions = {
      ...inputOptions,
      input: source,
      external: [...Object.keys(pkg.dependencies), ...externalFromPackage]
    }

    const mandatoryDeps = ['rollup']
    let deps = []
    let useBuble = false

    if (pkg.wrap) {
      if (pkg.wrap.buble) {
        useBuble = true
        deps = ['@rollup/plugin-buble']
      } else {
        deps = ['@babel/core', '@rollup/plugin-babel']
      }
    }

    await checkAndInstall([...mandatoryDeps, ...deps])
    let handler
    let options = {}
    if (useBuble) {
      handler = require('@rollup/plugin-buble')
      const fromPkg = (pkg.wrap && pkg.wrap.buble) || {}
      options = { ...bubleDefaultOptions, ...fromPkg }
    } else {
      const { babel } = require('@rollup/plugin-babel')
      handler = babel
      options = { babelHelpers: 'bundled' }
    }

    _inputOptions.plugins.push(handler(options))

    const _outputOptions = {
      ...outputOptions,
      file: main,
      banner: pkg.bin ? '#!/usr/bin/env node\n' : null
    }

    if (module) {
      const esmOutputOptions = {
        ...outputOptions,
        file: module,
        format: 'esm'
      }

      await writeBundle(_inputOptions, esmOutputOptions)

      console.log(
        `${logcons.info()} Module written to ${bullet(esmOutputOptions.file)}`
      )
    }

    await writeBundle(_inputOptions, _outputOptions)

    console.log(
      `${logcons.info()} CJS written to ${bullet(_outputOptions.file)}`
    )
    console.log(`${logcons.tick()} ${success('Done')}`)
  } catch (err) {
    errorHandler(err)
  }
}

async function writeBundle (_inputOptions, _outputOptions) {
  const rollup = require('rollup')
  const bundle = await rollup.rollup(_inputOptions)
  await bundle.generate(_outputOptions)
  await bundle.write(_outputOptions)
  await bundle.close()
}
