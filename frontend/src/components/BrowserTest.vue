<template>
  <div>
    <h1>Browser Test</h1>
    <BigButton :callback="start">Start</BigButton>
    <Output :messages="messages" />
    
  </div>
</template>

<script>
import BigButton from './BigButton.vue'
import Output from './Output.vue'

export default {
  name: 'BrowserTest',
  props: ['tests', 'runner'],
  components: {
    BigButton,
    Output
  },
  data() {
    return {
      messages: []
    }
  },
  methods: {
      start() {
        this.messages = []
        this.runner(this.tests, this.reporter(this.messages))
      },
      reporter(messages) {
        
        return {
          log(msg) {
            messages.push('➡️  ' + msg)
          },
          pass(description) {
            messages.push('✅  Step `' + description + '` passed')
          },
          fail(description, err) {
            messages.push('❌  Step  `' + description + '` failed', err)
          },
          success() {
            messages.push('👍  Success')
          },
          error() {
            messages.push('😭  Error')
          },
        }
          
      }
  }
}
</script>

<style>

</style>
