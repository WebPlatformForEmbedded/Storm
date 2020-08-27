const inquirer = require('inquirer')

export const getChoiceAsInputFromUser = (msg, choice, waitTime) => {
  let p1 = inquirer
    .prompt({
      type: 'checkbox',
      name: 'data',
      choices: [...choice],
      message: msg,
    })
    .then(answers => {
      return answers.data
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error('User not entered the input')
  })
  return Promise.race([p1, p2]).then(res => { return res})
    .catch(err => { console.log(`Error: ${err.message}`)})
}

export const getTextAsInputFromUser = (msg, waitTime) => {
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
    throw new Error('User not entered the input')
  })
  return Promise.race([p1, p2]).then(res => { return res})
    .catch(err => { console.log(`Error: ${err.message}`)})
}

export const getChoiceAsInputFromRawList = (message, choice, waitTime) => {
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
    throw new Error('User not entered the input')
  })
  return Promise.race([p1, p2]).then(res => { return res})
    .catch(err => { console.log(`Error: ${err.message}`)})
}
export const getPasswordAsInputFromUser = (msg, waitTime) => {
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
    throw new Error('User not entered the input')
  })
  return Promise.race([p1, p2]).then(res => { return res})
    .catch(err => { console.log(`Error: ${err.message}`)})
}

export const getConfirmationFromUser = (str, waitTime) => {
  let p1 = inquirer
    .prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: str,
      },
    ])
    .then(answer => {
      return answer.confirm
    })
  let p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime*1000)
  }).then(() => {
    throw new Error('User not entered the input')
  })
  return Promise.race([p1, p2]).then(res => { return res })
    .catch(err => { console.log(`Error: ${err.message}`)})
}


export default {
  getChoiceAsInputFromRawList,
  getTextAsInputFromUser,
  getPasswordAsInputFromUser,
  getConfirmationFromUser,
  getChoiceAsInputFromUser,
}
