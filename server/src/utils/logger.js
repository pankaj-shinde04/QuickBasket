const levels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
}

function formatMessage(level, message) {
  const timestamp = new Date().toISOString()
  return `[${timestamp}] [${levels[level]}] ${message}`
}

const logger = {
  info(message) {
    console.log(formatMessage('info', message))
  },
  warn(message) {
    console.warn(formatMessage('warn', message))
  },
  error(message) {
    console.error(formatMessage('error', message))
  },
}

export default logger
