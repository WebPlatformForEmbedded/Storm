import Inquirer from 'inquirer'
import ChexkboxPlus from 'inquirer-checkbox-plus-prompt'
import Chalk from 'chalk'
import Contra from 'contra'

import Runner from '../testrunner'
import Tests from '../tests'
import Reporter from './reporter'

Inquirer.registerPrompt('checkbox-plus', ChexkboxPlus)

// construct a list of tests to show as options
const listTests = tests => {
  let maxTitleLength = tests.reduce((max, test) => {
    return Math.max(test.title.length, max)
  }, 0)

  return tests.map((test, index) => {
    return {
      name: [
        test.title,
        // make sure each title is the same length
        ' '.repeat(maxTitleLength - test.title.length),
        '\t',
        Chalk.dim(test.description),
      ].join(' '),
      value: index,
      short: test.title,
    }
  })
}

// clear console
const clearConsole = () => {
  process.stdout.write('\x1b[2J')
  process.stdout.write('\x1b[0f')
}

const run = async () => {
  clearConsole()

  const tests = listTests(Tests)
  const questions = [
    {
      type: 'checkbox-plus',
      name: 'TESTS',
      message: [
        [
          'Select the test(s) you want to execute using the',
          Chalk.yellow('spacebar'),
          'then press',
          Chalk.yellow('enter'),
          'to start the Testrunner!',
        ].join(' '),
        [Chalk.yellow('➜'), Chalk.dim('Search by title / description:')].join(' '),
      ].join('\n'),
      searchable: true,
      source: (selected, input) => {
        return new Promise(function(resolve) {
          resolve(
            tests.filter(test => {
              return test.name.toLowerCase().includes(input.toLowerCase())
            })
          )
        })
      },
      pageSize: process.stdout.rows || 20,
    },
  ]

  Inquirer.prompt(questions).then(answers => {
    if (answers.TESTS.length) {
      clearConsole()
      Contra.each.series(answers.TESTS, (test, next) => {
        Runner(Tests[test], Reporter())
          .then(() => {
            setTimeout(next, 1500)
          })
          .catch(() => {
            setTimeout(() => next(), 1500)
          })
      })
    } else {
      console.log(Chalk.red('Please select 1 or more tests to run!'))
      setTimeout(() => {
        run()
      }, 1000)
    }
  })
}

run()
