// External dependency - System
import { promises as fs } from 'fs'

// External dependency - Package (to be added as peer dependency)
import get from 'lodash.get'

// Internal Dependency (written by the developer)
import logger from './logger'

const values = {
  a: {
    b: 1
  }
}

// Test Executing each
logger('Initializing')
fs.writeFile('hello.txt', Buffer.from('test content')).then(() => {
  logger(get(values, 'a.b', false))
  logger('Done')
})
