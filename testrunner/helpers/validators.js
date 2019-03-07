module.exports = {
    dummy(x) {
        return x === x
    },
    httpSuccess(response) {
        return response.status === 200
    },
    httpNotFound(response) {
        return response.status === 404
    },
}