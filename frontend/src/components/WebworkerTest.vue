<template>
  <div>
    <h1>Webworker Test</h1>
    <BigButton :callback="start">Start</BigButton>
    <Output :messages="messages" />
  </div>
</template>

<script>
import BigButton from './BigButton.vue'
import Output from './Output.vue'

export default {
  name: 'WebworkerTest',
  components: {
    BigButton,
    Output
  },
  data() {
    return {
      messages: [],
      worker: null,
    }
  },
  mounted() {
    this.worker = new Worker('./webworker.js?' + Math.random())
    this.worker.addEventListener('message', e => this.messages.push(e.data));
  },
  methods: {
      start() {
        this.messages = []
        this.worker.postMessage('start')
      }
  }
}
</script>

<style>

</style>
