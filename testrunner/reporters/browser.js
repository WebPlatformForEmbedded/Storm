export default {
  init(test) {
    write('🚀  Starting test `' + test.title + '`')
  },
  step(test, step) {
    write('🚀  Starting step `' + step.description + '`')
  },
  log(msg) {
    write('➡️  ' + msg)
  },
  sleep(milliseconds) {
    write('😴  Sleeping for ' + milliseconds / 1000 + ' seconds')
  },
  pass(test, step) {
    write('✅  Step `' + step.description + '` passed')
  },
  fail(test, step, err) {
    write('❌  Step  `' + step.description + '` failed', err)
  },
  success(test) {
    write('👍  Success')
  },
  error(test, err) {
    write('😭  Error', err)
  },
  finished(test) {
    write('🏁  Test finished running')
  },
}

const write = str => {
  let div = document.getElementById('output')
  if (!div) {
    div = document.createElement('div')
    div.setAttribute('id', 'output')
    document.body.appendChild(div)
  }

  div.innerHTML = '<p>' + str + '</p>' + div.innerHTML
}
