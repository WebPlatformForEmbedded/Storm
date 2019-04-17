<template>  
  <div>
      <button
          class="mb-8 bg-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded focus:outline-none"
          @click="start"
        >Start</button>
        <Output :messages="messages" v-if="messages.length" />
  </div>
</template>

<script>
import Runner from '../../../testrunner'
import Output from '@/components/Output.vue'
import Contra from 'contra'

export default {
  name: 'TestRunner',
  components: {
    Output,
  },
  data: () =>({
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
    }
  },
  mounted() {
    this.initiateWebworker()
  },
  methods: {
    initiateWebworker() {
      this.webworker = new Worker('/webworker.js?' + Math.random())
      this.webworker.addEventListener('message', this.listener);
    },
    start() {
      this.$store.commit('CLEAR_MESSAGES')

      Contra.each.series(this.tests, (test, next) => {
        this.next = next
        this.webworker.postMessage({
          action: 'start',
          testName: test.title,
          device: {ip: this.device.ip}
        })
      }, () => {
          this.$store.commit('ADD_MESSAGE', {message: '🎉  All tests done'})
      })
  
    },
    listener(event) {
      switch(event.data.type) {
        
        case 'message':
          this.$store.commit('ADD_MESSAGE', {message: ['➡️', event.data.payload && event.data.payload.message].join('   ')})
        break

        case 'pass':
          this.$store.commit('ADD_MESSAGE', {message: ['✅', event.data.payload && event.data.payload.message].join('   ')})
        break

        case 'fail':
          this.$store.commit('ADD_MESSAGE', {message: ['❌', event.data.payload && event.data.payload.message].join('   ')})
        break

        case 'success':
          this.$store.commit('ADD_MESSAGE', {message: ['👍', event.data.payload && event.data.payload.message].join('   ')})
          this.nextTest()
        break        
        
        case 'error':
          this.$store.commit('ADD_MESSAGE', {message: ['😭', event.data.payload && event.data.payload.message].join('   ')})
          this.nextTest()
        break
      }
    },
    nextTest() {
      if(this.next && typeof this.next === 'function') {
        setTimeout(() => {
          this.next()
        }, 2000)
      }
    }
  }
}
</script>

<style>
</style>
