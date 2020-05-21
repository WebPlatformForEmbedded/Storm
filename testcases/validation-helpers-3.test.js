export default {
  title: 'Dummy - Validation helpers - 3',
  description: 'Using custom validation expectations',
  steps: [
    {
      description: 'Test to be within range',
      test() {
        const randomInt = Math.floor(Math.random() * 10) + 1
        this.$log('Random int - ' + randomInt)
        return randomInt
      },
      validate(result) {
        return this.$expect(result).to.be.withinRange(0, 10)
      },
    },
    {
      description: 'Testing a successful http response',
      test() {
        return this.$http
          .get('https://dog.ceo/api/breeds/image/random')
          .then(response => response)
          .catch(e => {
            return e
          })
      },
      validate(response) {
        return this.$expect(response).to.be.httpSuccess()
      },
    },
    {
      description: 'Testing a 404 http response',
      test() {
        return this.$http.get('https://github.com/404').catch(e => {
          return e.response
        })
      },
      validate(response) {
        return this.$expect(response).to.be.httpNotFound()
      },
    },
  ],
}
