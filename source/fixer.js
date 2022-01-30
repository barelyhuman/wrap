import { depdown } from 'depdown'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { green, red, reset, white, yellow } from 'kleur'
import { logcons } from 'logcons'
import { resolvePackage } from './resolve-pkg'

const info = reset().cyan
const bullet = white().bold

export const fixer = async () => {
  const pkg = resolvePackage()
  const typescriptEnabled = (pkg.wrap && pkg.wrap.typescript) || false

  if (!typescriptEnabled) {
    console.log(
      info(
        `Typescript is enabled, checking if ${bullet(
          'prettier'
        )} is installed...`
      )
    )
    await depdown(['prettier'], { tree: 'dev' })
  } else {
    await depdown(['standard'], { tree: 'dev' })
  }

  if (!typescriptEnabled) {
    useStandard()
    return
  }

  console.log(
    info(`Adding prettier scripts to your ${bullet('package.json')}`)
  )

  await writePrettierDefaults('.prettierrc')
  await addPrettierToScripts('package.json')

  console.log(bullet('Use `yarn fix` or `npm run fix` instead'))
}

async function addPrettierToScripts (file) {
  let fileData = await readFile(file)
  fileData = JSON.parse(fileData.toString())
  fileData.scripts = fileData.scripts || {}
  fileData.scripts.fix =
    (fileData.scripts.fix.length ? fileData.scripts.fix + ';' : '') +
    'prettier --write .'

  await writeFile(file, JSON.stringify(fileData, null, 2))
}

async function writePrettierDefaults (file) {
  const defOptions = {
    bracketSpacing: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    useTabs: true
  }

  if (existsSync(file)) {
    return
  }
  await writeFile(file, JSON.stringify(defOptions, null, 2))
}

function useStandard () {
  const standard = require('standard')
  standard.lintFiles(
    [],
    {
      fix: true
    },
    (err, done) => {
      if (err) {
        console.error(err)
      }
      if (done.errorCount > 0) {
        return printLinterErrors(done.results)
      } else {
        console.log(`${logcons.tick()} ${green().bold('Done')}`)
      }
    }
  )
}

function printLinterErrors (results) {
  for (const file of results) {
    if (!file.messages.length) {
      continue
    }
    file.messages.forEach((x) => formatMessage(x, file))
  }

  console.log(`${logcons.warn()} ${yellow().bold('Fix linter errors.')}`)
}

function formatMessage (resultItem, file) {
  console.log(
    `${red().bold('wrap-fixer')} ${white().bold(file.filePath)}:${
      resultItem.line
    }:${resultItem.column} - ${resultItem.ruleId}`
  )
}
