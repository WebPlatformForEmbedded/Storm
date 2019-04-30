<template>
  <div class="border-b mb-4">
    <h4 class="text-lg text-dark-blue mb-4">Test suite</h4>
    <div class="w-full h-3 bg-light-grey border border-grey rounded-lg mt-4 mb-2">
      <div
        :style="{ width: progress + '%', transition: 'all .3s ease' }"
        :class="{
          'bg-blue': progress < 100,
          'bg-green': progress >= 100 && hasNoErrors,
          'bg-red': progress >= 100 && hasErrors,
        }"
        class="h-full rounded-lg text-sm"
      >
        &nbsp;
      </div>
    </div>
    <div class="text-grey text-sm mb-4">
      {{ lastMessage && lastMessage.payload && lastMessage.payload.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuiteProgress',
  props: {
    tests: {
      type: Array,
      default: () => [],
    },
    messages: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    progress() {
      return parseInt((this.completedTests / this.nrTests) * 100)
    },
    nrTests() {
      return this.tests.length
    },
    completedTests() {
      return this.messages.filter(message => {
        return message.type === 'success' || message.type === 'error'
      }).length
    },
    lastMessage() {
      const messages = this.messages.filter(message => {
        return ['init', 'done'].indexOf(message.type) > -1
      })
      const message = messages.length ? messages[0] : null
      return message
    },
    hasNoErrors() {
      return !this.hasErrors
    },
    hasErrors() {
      return this.messages.filter(message => message.type === 'error').length > 0
    },
  },
}
</script>

<style></style>
