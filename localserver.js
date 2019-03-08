const port = 1313
const url = require('url')
const http = require('http')

// spin up a local server to test the timeouts
// quick and dirty for now, better would be to have
// setup and teardown methods for tests / steps that
// can do this kind of stuff
const app = http.createServer((request, response) => {

    const query = url.parse(request.url, true).query;

    setTimeout(() => {
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write('Hello world!')
        response.end()
    }, (query.timeout * 1000) || 0) 
    
})

app.listen(port, () => {
    console.log('Started local server on port ' + port)
})

// Make sure the server doesn't run forever
// again, this would be a typical 'teardown' of a test
setTimeout(() => {
    app.close(() => {
        console.log('Closed local server on port ' + port)
    })
}, 60 * 1000)