import mri from 'mri'
import { bundler } from './bundler'
import { fixer } from './fixer'
import { usage } from './usage'

function cli () {
  const argv = process.argv.slice(2)
  const flags = mri(argv, {
    default: {
      fix: false
    },
    alias: {
      f: 'fix'
    },
    boolean: ['f', 'fix'],
    unknown: (arg) => console.log(usage)
  })

  if (!flags) {
    return process.exit(1)
  }

  if (flags.fix) {
    return fixer()
  }

  return bundler()
}

cli()
