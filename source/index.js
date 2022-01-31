import mri from 'mri'
import { bundler } from './bundler'
import { fixer } from './fixer'
import { usage } from './usage'

function cli () {
  const argv = process.argv.slice(2)
  const flags = mri(argv, {
    default: {
      fix: false,
      help: false,
      watch: false,
      minify: false,
      input: '',
      style: 'standard'
    },
    alias: {
      i: 'input',
      f: 'fix',
      h: 'help',
      w: 'watch',
      m: 'minify'
    },
    boolean: ['f', 'fix', 'h', 'help', 'w', 'watch', 'm', 'minify'],
    unknown: (arg) => console.log(usage)
  })

  const opts = { input: flags.input, minify: flags.minify }

  if (!flags) {
    return process.exit(1)
  }

  if (flags.fix) {
    return fixer({ style: flags.style })
  }

  if (flags.help) {
    return console.log(usage)
  }

  if (flags.watch) {
    opts.watch = true
  }

  return bundler({ ...opts })
}

cli()
