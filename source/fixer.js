import { depdown } from 'depdown'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { green, red, white, yellow, cyan, bold, dim } from 'picocolors'
import { logcons } from 'logcons'

const info = cyan
const bullet = (x) => bold(white(x))

export const fixer = async ({ style = 'standard' }) => {
  switch (style) {
    case 'standard': {
      await depdown(['standard'], { tree: 'dev' })
      useStandard()
      break
    }
    case 'prettier': {
      console.log(dim('Setting up prettier '))
      await depdown(['prettier'], { tree: 'dev' })
      console.log(
        dim(`Adding prettier scripts to your ${bullet('package.json')}`)
      )
      await writePrettierDefaults('.prettierrc')
      await addPrettierToScripts('package.json')
      console.log(
        info(
          `Added prettier to scripts, you can now use ${bullet(
            'yarn fix'
          )} or ${bullet('npm run fix')} to run the formatter`
        )
      )
      break
    }
  }

  process.exit(0)
}

async function addPrettierToScripts (file) {
  let fileData = await readFile(file)
  fileData = JSON.parse(fileData.toString())
  fileData.scripts = fileData.scripts || {}
  fileData.scripts.fix =
    (fileData.scripts.fix.length ? fileData.scripts.fix + ';' : '').replace(
      /(;prettier --write .)/g,
      ''
    ) + 'prettier --write .'

  await writeFile(file, JSON.stringify(fileData, null, 2))
}

async function writePrettierDefaults (file) {
  const defOptions = {
    bracketSpacing: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    useTabs: false
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
