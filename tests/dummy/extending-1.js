import baseTest from './basic.js'

export default {
  ...baseTest,
  ...{
    title: 'Dummy - Extending - 1',
    description: 'Testing that we can extend a test with a base test',
    // note this test doesn't have any steps or functionality of it's own
  },
}
