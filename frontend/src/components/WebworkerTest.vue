<template>
  <div>
    <h1>Webworker Test</h1>
    <BigButton :callback="start">Start</BigButton>
  </div>
</template>

<script>
import BigButton from './BigButton.vue'

export default {
  name: 'WebworkerTest',
  components: {
    BigButton
  },
  methods: {
    start() {
      alert('Work in progress ...')
    }
  }
}
</script>

<style>

</style>
