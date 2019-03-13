<template>
  <div id="app">
    <BrowserTest :tests="tests" :runner="runner" />
    <hr />
    <WebworkerTest />
  </div>
</template>

<script>
import BrowserTest from './components/BrowserTest.vue'
import WebworkerTest from './components/WebworkerTest.vue'
import Runner from '../../src/runner'
import Config from '../../config'

export default {
  name: 'app',
  components: {
    BrowserTest,
    WebworkerTest,
  },
  computed: {
    tests: () => Config.tests,
    runner: () => Runner
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
hr {
  border: none;
  background: #ccc;
  height: 2px;
  width: 100%;
  margin: 20px 0;
}
</style>
