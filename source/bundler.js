import { depdown } from 'depdown'
import { reset, white } from 'kleur'
import { logcons } from 'logcons'
import sizesnap from 'sizesnap-lite'
import { errorHandler } from './error-handler'
import { resolvePackage } from './resolve-pkg'
import Spinner from './spinner'

const info = reset().cyan
const bullet = white().bold
const success = reset().green().bold
const infoIcon = logcons.info((c) => info(c))
const bundleSpinner = Spinner({ message: 'Bundling...', color: info })
const watchSpinner = Spinner({ message: 'Watching...', color: info })

const defaultOptions = {
  rollup: {
    input: {
      plugins: [],
      external: []
    },
    output: {
      format: 'cjs'
    }
  },
  terser: {
    compress: {
      passes: 10
    },
    mangle: true
  }
}

export const bundler = async (
  { watch, input: inputFile, minify } = { minify: true }
) => {
  try {
    const pkg = resolvePackage()

    const { source, main, module } = pkg

    inputFile = inputFile || source

    const isMissingBaseFields = !(main && inputFile)

    if (isMissingBaseFields) {
      throw new Error(
        `'package.source' or 'package.main' not found, add ${bullet(
          'source and main'
        )} fields to your package.json`
      )
    }

    const externalPackages = (pkg.wrap && pkg.wrap.external) || []
    const inferExternalPackages = (pkg.wrap && pkg.wrap.inferExternal) || []

    const currentDeps = pkg.dependencies || {}

    const inputOptions = {
      ...defaultOptions.rollup.input,
      input: inputFile,
      external: [...Object.keys(currentDeps), ...externalPackages]
    }

    const mandatoryDeps = ['rollup', 'rollup-plugin-terser']
    const deps = ['@babel/core', '@rollup/plugin-babel']
    let supportTS = false

    if (inferExternalPackages) {
      deps.push('rollup-plugin-node-externals')
    }

    if (pkg.wrap) {
      if (pkg.wrap.typescript) {
        supportTS = true
        deps.push('typescript')
        deps.push('@rollup/plugin-typescript')
        deps.push('tslib')
      }
    }

    // Install needed dependencies
    await depdown([...mandatoryDeps, ...deps], { tree: 'dev' })

    bundleSpinner.start()

    const { transpiler, options } = getTranspilerAndOptions()

    if (supportTS) {
      const typescript = require('@rollup/plugin-typescript')
      let tsOptions = {}

      // has config directly here
      if (typeof pkg.wrap.typescript === 'object') {
        tsOptions = pkg.wrap.typescript
      }

      // path to config
      if (typeof pkg.wrap.typescript === 'string') {
        tsOptions = {
          tsconfig: pkg.wrap.typescript
        }
      }
      inputOptions.plugins.push(typescript(tsOptions))
    } else {
      inputOptions.plugins.push(transpiler(options))
    }

    if (minify) {
      const { terser } = require('rollup-plugin-terser')
      const options = (pkg.wrap && pkg.wrap.terser) || defaultOptions.terser
      inputOptions.plugins.push(terser(options))
    }

    const bundlerOptions = [
      {
        ...defaultOptions.rollup.output,
        file: main,
        banner: pkg.bin ? '#!/usr/bin/env node\n' : null
      }
    ]

    if (module) {
      bundlerOptions.push({
        ...defaultOptions.rollup.output,
        file: module,
        format: 'esm'
      })
    }

    if (inferExternalPackages) {
      const externals = require('rollup-plugin-node-externals')
      inputOptions.plugins.push(externals())
    }

    const rollupHandler = watch ? watchPackage : writeBundle

    await Promise.all(
      bundlerOptions.map((config) => {
        return rollupHandler(inputOptions, config)
      })
    )

    const sizingPromises = []
    bundleSpinner.stop(success('>> Bundled\n'))
    const files = bundlerOptions.map((x) => {
      sizingPromises.push(sizesnap(x.file).then(console.log))
      return x.file
    })

    await Promise.all(sizingPromises)
    console.log(`\nFiles written ${bullet(files.join(', '))}\n`)
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

async function watchPackage (_inputOptions, _outputOptions) {
  watchSpinner.start()
  const rollup = require('rollup')
  const watchOptions = {
    ..._inputOptions,
    output: [_outputOptions]
  }
  const watcher = rollup.watch(watchOptions)
  watcher.on('event', ({ result }) => {
    if (!result) {
      return
    }
    watchSpinner.stop()
    console.log(`${infoIcon} Compiled ${bullet(_outputOptions.file)}`)
    watchSpinner.start()
    result.close()
  })
}

function getTranspilerAndOptions () {
  const { babel } = require('@rollup/plugin-babel')
  const transpiler = babel
  const options = { babelHelpers: 'bundled' }
  return { transpiler, options }
}
