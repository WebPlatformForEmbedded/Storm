module.exports = {
    log(msg) {
        write('➡️  ' + msg)
    },
    pass(description) {
        write('✅  Step `' + description + '` passed')
    },
    fail(description, err) {
        write('❌  Step  `' + description + '` failed', err)
    },
    success() {
        write('👍  Success')
    },
    error() {
        write('😭  Error')
    },
    
}

const write = (str) => {
    let div = document.getElementById('output')
    if(!div) {
        div = document.createElement('div')
        div.setAttribute('id', 'output')
        document.body.appendChild(div)
    }

    div.innerHTML = '<p>' + str + '</p>' + div.innerHTML

}