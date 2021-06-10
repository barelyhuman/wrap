import mri from 'mri'
import { bundler } from './bundler'
import { fixer } from './fixer'
import { usage } from './usage'

function cli () {
  const argv = process.argv.slice(2)
  const flags = mri(argv, {
    default: {
      fix: false,
      help: false
    },
    alias: {
      f: 'fix',
      h: 'help'
    },
    boolean: ['f', 'fix', 'h', 'help'],
    unknown: (arg) => console.log(usage)
  })

  if (!flags) {
    return process.exit(1)
  }

  if (flags.fix) {
    return fixer()
  }

  if (flags.help) {
    return console.log(usage)
  }

  return bundler()
}

cli()
