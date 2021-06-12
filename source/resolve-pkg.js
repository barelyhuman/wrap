import { resolve } from 'path'
import { existsSync } from 'fs'
import { white } from 'kleur'

const bullet = white().bold

export function resolvePackage () {
  const pkgfile = resolve('package.json')
  const pkg = existsSync(pkgfile) && require(pkgfile)
  if (!pkg) {
    throw new Error(
      `'package' not found, add a ${bullet('package.json')} to your project`
    )
  }
  return pkg
}
