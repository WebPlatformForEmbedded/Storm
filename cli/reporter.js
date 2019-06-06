import LogUpdate from 'log-update'
import Chalk from 'chalk'

export default () => {
  const log = {
    test: null,
    steps: [],
    status: null,
    log: [],
  }

  return {
    init(test) {
      log.test = test
      log.test.status = 'started'
      log.test.finished = false
      log.steps = test.steps
      render(log)
    },
    step(test, step) {
      const index = findStepByDescription(log.steps, step.description)
      if (index > -1) {
        log.steps[index].status = 'started'
      }
      render(log)
    },
    log(msg) {
      log.log.push(msg)
      render(log)
    },
    sleep(milliseconds) {
      log.log.push('Sleeping for ' + milliseconds / 1000 + ' seconds')
      render(log)
    },
    pass(test, step) {
      const index = findStepByDescription(log.steps, step.description)
      if (index > -1) {
        log.steps[index].status = 'pass'
      }
      render(log)
    },
    fail(test, step, err) {
      const index = findStepByDescription(log.steps, step.description)
      if (index > -1) {
        log.steps[index].status = 'fail'
      }
      render(log)
    },
    success(test) {
      log.test.status = 'success'
      render(log)
    },
    error(test, err) {
      log.test.status = 'error'
      render(log)
    },
    finished(test) {
      log.test.finished = true
      render(log)
    },
  }
}

const findStepByDescription = (steps, description) => {
  return steps.findIndex(step => step.description === description)
}

const indent = (str, level) => ' '.repeat((level || 1) * 3) + str

const icon = status => {
  let icon
  switch (status) {
    case 'started':
      icon = Chalk.yellow('➜')
      break
    case 'fail':
    case 'error':
      icon = Chalk.red('✖')
      break
    case 'pass':
    case 'success':
      icon = Chalk.green('✔')
      break
    default:
      icon = Chalk.dim('●')
      break
  }
  return icon
}

const render = log => {
  const output = [
    renderTestHeader(log.test),
    renderSteps(log.steps),
    renderLogMessages(log),
    renderFinish(log),
  ]

  LogUpdate(output.join('\n'))

  // start a new log session (but persist the previous one)
  if (log.test && log.test.finished === true) {
    LogUpdate.done()
  }
}

const renderTestHeader = test => {
  const output = []
  if (test) {
    output.push(renderSeparator())
    output.push([icon(test.status), test.title].join('  '))
    output.push(Chalk.dim(indent(test.description)))
    output.push(renderSeparator())
  }
  return output.join('\n')
}

const renderSteps = steps => {
  const output = []
  steps.forEach(step => {
    output.push(indent([icon(step.status), step.description].join('  ')))
  })
  return output.join('\n')
}

const renderLogMessages = log => {
  const output = []
  if (log.test) {
    if (log.test.finished === true) {
      output.push(Chalk.dim(indent('Log report:')))
      log.log.forEach(msg => {
        output.push(Chalk.dim.italic(indent(['-', msg].join('  '))))
      })
    } else {
      // latest log message
      output.push(indent(Chalk.dim(log.log.length ? log.log[log.log.length - 1] : ' ')))
    }
  }
  return output.join('\n')
}

const renderFinish = log => {
  const output = []
  if (log.test && log.test.finished === true) {
    output.push(renderSeparator('_'))
    output.push(' ')
    output.push(' ')
  }

  return output.join('\n')
}

const renderSeparator = separator => {
  return Chalk.dim((separator || '-').repeat(process.stdout.columns))
}
