import { green, red, white, yellow } from 'kleur'
import { logcons } from 'logcons'
import { checkAndInstall } from './check-and-install'

export const fixer = async () => {
  await checkAndInstall(['standard'])
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
    `${red().bold('wrap-fixer')} ${white().bold(file.filePath)}${
      resultItem.line
    }:${resultItem.column} - ${resultItem.ruleId}`
  )
}
