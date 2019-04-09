<template>
  <div>
    <h1 class="text-xl mb-8">Test runner</h1>
    <p class="text-sm">Run the dummy test (only browser based for now).</p>
    <BigButton :callback="start" class="my-8">Start</BigButton>
    <Output :messages="messages" />
  </div>
</template>

<script>
import BigButton from '@/components/BigButton.vue'
import Output from '@/components/Output.vue'
import Runner from '../../../testrunner'
import Tests from '../../../tests'

export default {
  name: 'testrunner',
  components: {
    BigButton,
    Output
  },
  data() {
    return {
      messages: []
    }
  },
  computed: {
    tests: () => Tests,
    runner: () => Runner,
  },
  methods: {
      start() {
        this.messages = []
        this.runner(this.tests[0], this.reporter(this.messages))
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
