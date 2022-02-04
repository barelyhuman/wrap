import { red } from 'picocolors'
import { logcons } from 'logcons'

export function errorHandler (err) {
  const msg = (err.message || err || 'Unknown error').replace(
    /(\r?\n)/g,
    '$1      '
  )
  console.error(`${logcons.cross()} ${red().bold('wrap ')}${msg}`)
  process.exit(1)
}
