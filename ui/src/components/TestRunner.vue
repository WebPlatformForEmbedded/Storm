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
    messages: [],
  }),
  computed: {
    runner: () => Runner,
    tests() {
      return this.$store.state.tests
    }
  },
  methods: {
    start() {
      this.messages = []

       Contra.each.series(this.tests, (test, next) => {
        
            this.runner(test, this.reporter(this.messages), {ip: '192.168.15.20'}).then(() => {
                setTimeout(next, 2000)
            }).catch(err => {
                console.error(err)
                next(err)
            })

        }, () => {
            this.messages.unshift('🎉  All tests done')
        })
  
    },
    reporter(messages) {
      
      return {
        log(msg) {
          messages.unshift('➡️  ' + msg)
        },
        pass(description) {
          messages.unshift('✅  Step `' + description + '` passed')
        },
        fail(description, err) {
          messages.unshift('❌  Step  `' + description + '` failed', err)
        },
        success() {
          messages.unshift('👍  Success')
        },
        error() {
          messages.unshift('😭  Error')
        },
      }
        
    }
  }
}
</script>

<style>
</style>
