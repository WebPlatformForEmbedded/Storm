const inquirer = require('inquirer')

const errMessage = 'User not provided any input'

export const selectChoices = (msg, choices, waitTime = 10) => {
  let p1 = inquirer
    .prompt({
      type: 'checkbox',
      name: 'data',
      choices: [...choices],
      message: msg,
    })
    .then(answers => {
      return answers.data
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error(errMessage)
  })
  return Promise.race([p1, p2]).then(res => { return res})
}

export const selectOption = (msg, option, waitTime = 10) => {
  let p1 = inquirer
    .prompt({
      type: 'list',
      name: 'data',
      choices: [...option],
      message: msg,
    })
    .then(answers => {
      return answers.data
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error(errMessage)
  })
  return Promise.race([p1, p2]).then(res => { return res})
}

export const enterText = (msg, waitTime = 10) => {
  let p1 = inquirer
    .prompt({
      type: 'input',
      name: 'input',
      message: msg,
    })
    .then(answers => {
      return answers.input
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error(errMessage)
  })
  return Promise.race([p1, p2]).then(res => { return res})
}

export const enterNumberForChoice = (message, choice, waitTime = 10) => {
  let p1 = inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'rawlist',
        message: message,
        choices: [...choice],
      },
    ])
    .then(answers => {
      return answers.rawlist
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error(errMessage)
  })
  return Promise.race([p1, p2]).then(res => { return res})
}

export const enterPassword = (msg, waitTime = 10) => {
  let p1 = inquirer
    .prompt([
      {
        type: 'password',
        message: msg,
        name: 'password',
        mask: '*',
      },
    ])
    .then(answers => {
      return answers.password
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error(errMessage)
  })
  return Promise.race([p1, p2]).then(res => { return res})
}

export const getConfirmationFromUser = (message, waitTime = 10) => {
  let p1 = inquirer
    .prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: message,
      },
    ])
    .then(answer => {
      return answer.confirm
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error(errMessage)
  })
  return Promise.race([p1, p2]).then(res => { return res})
}


export default {
  enterNumberForChoice,
  enterText,
  enterPassword,
  getConfirmationFromUser,
  selectChoices,
  selectOption
}
