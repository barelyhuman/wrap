import { white, green } from 'kleur'
import { logcons } from 'logcons'
import { depdown } from 'depdown'
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

const terserDefaultOptions = {
  compress: {
    passes: 10
  }
}

const bubleDefaultOptions = {
  transforms: {
    asyncAwait: false,
    forOf: false
  },
  objectAssign: 'Object.assign'
}

export const bundler = async ({ watch, minify } = { minify: true }) => {
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

    const existingDependencies = pkg.dependencies || {}

    const _inputOptions = {
      ...inputOptions,
      input: source,
      external: [...Object.keys(existingDependencies), ...externalFromPackage]
    }

    const mandatoryDeps = ['rollup', 'rollup-plugin-terser']
    let deps = ['@babel/core', '@rollup/plugin-babel']
    let useBuble = false
    let supportTS = false

    if (pkg.wrap) {
      if (pkg.wrap.buble) {
        useBuble = true
        deps = ['@rollup/plugin-buble']
      }
      if (pkg.wrap.typescript) {
        supportTS = true
        deps.push('typescript')
        deps.push('rollup-plugin-esbuild')
      }
    }

    // Install needed dependencies
    await depdown([...mandatoryDeps, ...deps], { tree: 'dev' })

    const { transpiler, options } = getTranspilerAndOptions(pkg, useBuble)

    if (supportTS) {
      const esbuild = require('rollup-plugin-esbuild')
      _inputOptions.plugins.push(esbuild(pkg.wrap.typescript))
    } else {
      _inputOptions.plugins.push(transpiler(options))
    }

    if (minify) {
      const { terser } = require('rollup-plugin-terser')
      const options = (pkg.wrap && pkg.wrap.terser) || terserDefaultOptions

      _inputOptions.plugins.push(terser(options))
    }

    const _outputOptions = {
      ...outputOptions,
      file: main,
      banner: pkg.bin ? '#!/usr/bin/env node\n' : null
    }

    const rollupHandler = watch ? watchPackage : writeBundle

    if (module) {
      const esmOutputOptions = {
        ...outputOptions,
        file: module,
        format: 'esm'
      }

      await rollupHandler(_inputOptions, esmOutputOptions)
    }

    await rollupHandler(_inputOptions, _outputOptions)
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
  console.log(
    `${logcons.info()} ${
      _outputOptions.format === 'esm' ? 'ESM' : 'CJS'
    } written to ${bullet(_outputOptions.file)}`
  )
  console.log(`${logcons.tick()} ${success('Done')}`)
}

async function watchPackage (_inputOptions, _outputOptions) {
  const rollup = require('rollup')
  const watchOptions = {
    ..._inputOptions,
    output: [_outputOptions]
  }
  const watcher = rollup.watch(watchOptions)

  watcher.on('event', ({ result }) => {
    if (result) {
      result.close()
      console.log(
        `${logcons.info()} ${
          _outputOptions.format === 'esm' ? 'ESM' : 'CJS'
        } written to ${bullet(_outputOptions.file)}`
      )
    }
  })
}

function getTranspilerAndOptions (pkg, useBuble) {
  let transpiler
  let options = {}
  if (useBuble) {
    transpiler = require('@rollup/plugin-buble')
    const fromPkg = (pkg.wrap && pkg.wrap.buble) || {}
    options = { ...bubleDefaultOptions, ...fromPkg }
  } else {
    const { babel } = require('@rollup/plugin-babel')
    transpiler = babel
    options = { babelHelpers: 'bundled' }
  }
  return { transpiler, options }
}
