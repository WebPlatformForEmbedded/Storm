const inquirer = require('inquirer')

export const getChoiceAsInputFromUser = (msg, choice) => {
  return inquirer.prompt({
    type: 'checkbox',
    name: 'data',
    choices: [...choice],
    message: msg,
  }).then(answers => {
    return answers.data
  })
}
export const getTextAsInputFromUser = (msg) => {
  return inquirer.prompt({
    type: 'input',
    name: 'input',
    message: msg,
  }).then(answers => {
    return answers.input
  })
}

export const getChoiceAsInputFromRawList = (message, choice ) => {
  return inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'rawlist',
        message: message,
        choices: [...choice],
      },
    ])
    .then((answers) => {
      return answers.rawlist
    });
}
export const getPasswordAsInputFromUser = (msg) => {
  return inquirer
    .prompt([
      {
        type: 'password',
        message: msg,
        name: 'password',
        mask: '*'
      },
    ]).then((answers) => {
      return answers.password
    });
}

export const getConfirmationFromUser = (str) => {
  return inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: str,
      },
    ])
    .then((answer) => {
      return(answer.confirm);
    });
}

export default {
  getChoiceAsInputFromRawList,
  getTextAsInputFromUser,
  getPasswordAsInputFromUser,
  getConfirmationFromUser,
  getChoiceAsInputFromUser
}
