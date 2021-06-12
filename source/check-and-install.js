import { exec } from 'child_process'
import { errorHandler } from './error-handler'
import { reset, white } from 'kleur'
import { resolvePackage } from './resolve-pkg'

const bullet = white().bold

export const checkAndInstall = async (deps) => {
  console.log(reset().cyan('Checking for dependencies...'))

  const pkg = resolvePackage()

  const installed = []

  checkDeps(pkg.dependencies, deps, installed)

  if (installed.length !== deps.length) {
    checkDeps(pkg.devDependencies, deps, installed)
  }

  const toInstall = deps.reduce((acc, item) => {
    if (installed.indexOf(item) === -1) {
      acc.push(item)
    }
    return acc
  }, [])

  if (!toInstall.length) {
    console.log(reset().dim('Nothing to install.'))
    return
  }

  const cmd = `npm install -D ${toInstall.join(' ')}`

  console.log(`${bullet('Running:')} ${cmd}`)

  const child = exec(cmd)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  child.on('error', (err) => {
    errorHandler(err)
  })

  return await new Promise((resolve) => {
    child.on('exit', () => {
      resolve()
    })
  })
}

function checkDeps (depType = {}, deps = [], source = []) {
  Object.keys(depType).forEach((item) => {
    if (deps.indexOf(item) > -1 && source.indexOf(item) === -1) {
      source.push(item)
    }
  })
}
