import spinner from 'elegant-spinner'
import logUpdate from 'log-update'
const frame = spinner()

function Spinner ({ message = '', color = (x) => x } = {}) {
  let spinnerId

  const start = () => {
    spinnerId = setInterval(() => {
      logUpdate(color(frame()) + ' ' + message)
    }, 100)
  }

  const stop = (msg) => {
    if (msg) {
      logUpdate(msg)
    } else {
      logUpdate.clear()
    }
    clearInterval(spinnerId)
  }

  const setMessage = (msg) => {
    message = msg
  }

  return {
    start,
    setMessage,
    stop
  }
}

export default Spinner
