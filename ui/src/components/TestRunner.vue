<template>
  <div>
    <h2 class="text-lg text-dark-blue mb-8">Run tests</h2>

    <button
      class="mb-8 bg-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded focus:outline-none"
      @click="start"
    >
      Start
    </button>

    <div class="flex flex-wrap w-full">
      <div class="w-full">
        <SuiteProgress :tests="tests" :messages="messages" />
      </div>
    </div>
    <div class="flex flex-wrap w-full">
      <div class="w-1/2">
        <Output v-if="messages.length" :messages="messages" />
      </div>
      <div class="w-1/2 pl-8">
        <TestProgress
          v-for="test in tests"
          :key="'test' + test.title"
          :test="test"
          :messages="messages"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Contra from 'contra'

import Runner from '../../../testrunner'
import Output from '@/components/Output.vue'
import TestProgress from '@/components/TestProgress'
import SuiteProgress from '@/components/SuiteProgress'

export default {
  name: 'TestRunner',
  components: {
    Output,
    TestProgress,
    SuiteProgress,
  },
  data: () => ({
    webworker: null,
    next: null,
  }),
  computed: {
    runner: () => Runner,
    tests() {
      return this.$store.state.tests
    },
    device() {
      return this.$store.state.device
    },
    messages() {
      return this.$store.state.messages
    },
  },
  mounted() {
    this.initiateWebworker()
  },
  methods: {
    initiateWebworker() {
      this.webworker = new Worker('/webworker.js?' + Math.random())
      this.webworker.addEventListener('message', this.listener)
    },
    start() {
      this.$store.commit('CLEAR_MESSAGES')

      Contra.each.series(
        this.tests,
        (test, next) => {
          this.next = next
          this.webworker.postMessage({
            action: 'start',
            testName: test.title,
            device: { ip: this.device.ip },
          })
        },
        () => {
          this.$store.commit('ADD_MESSAGE', {
            type: 'done',
            payload: { message: 'All tests done' },
          })
        }
      )
    },
    listener(event) {
      this.$store.commit('ADD_MESSAGE', event.data)
      // call next test depending on type of event
      if (['success', 'error'].indexOf(event.data.type) > -1) {
        this.nextTest()
      }
    },
    nextTest() {
      if (this.next && typeof this.next === 'function') {
        setTimeout(() => {
          this.next()
        }, 2000)
      }
    },
  },
}
</script>

<style></style>
