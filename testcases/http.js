export default {
  title: 'Dummy - Http',
  description: 'Testing that we can use the Axios (http) library in the tests',
  steps: [
    {
      description: 'Retrieving a random dog',
      test() {
        return this.$http
          .get('https://dog.ceo/api/breeds/image/random')
          .then(response => {
            return response.data
          })
          .catch(e => {
            return e
          })
      },
      validate(json) {
        return 'message' in json && json.status === 'success'
      },
    },
  ],
}
