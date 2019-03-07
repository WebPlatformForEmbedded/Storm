module.exports = {
    dummy(x) {
        return x === x
    },
    httpSuccess(response) {
        console.log('checking http response')
        return response.status === 200
    },
    httpNotFound(response) {
        return response.status === 404
    },
}