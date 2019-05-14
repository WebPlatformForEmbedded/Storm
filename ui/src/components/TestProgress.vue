<template>
  <div class="border-b mb-4">
    <h4 class="text-lg text-dark-blue mb-4">{{ test.title }}</h4>
    <p class="text-dark-grey italic">{{ test.description }}</p>
    <div class="w-full h-3 bg-light-grey border border-grey rounded-lg mt-4 mb-2">
      <div
        :style="{ width: progress + '%', transition: 'all .3s ease' }"
        :class="{
          'bg-blue': progress < 100 && lastMessage && lastMessage.type !== 'finished',
          'bg-green':
            progress >= 100 &&
            lastMessage &&
            lastMessage.type === 'finished' &&
            lastMessage.payload &&
            !lastMessage.payload.error,
          'bg-red':
            lastMessage &&
            lastMessage.type === 'finished' &&
            lastMessage.payload &&
            lastMessage.payload.error,
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
  name: 'TestProgress',
  props: {
    test: {
      type: Object,
      default: () => ({}),
    },
    messages: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    progress() {
      return parseInt((this.completedSteps / this.nrStepsWithRepetitions) * 100)
    },
    testMessages() {
      return this.messages.filter(message => {
        return message.payload.test ? message.payload.test.title === this.test.title : false
      })
    },
    lastMessage() {
      const message = this.testMessages.length ? this.testMessages[0] : null
      return message
    },
    nrSteps() {
      return this.test.steps.length
    },
    nrStepsWithRepetitions() {
      return Array.isArray(this.test.steps.reduce)
        ? this.test.steps.reduce((nr, step) => {
            return nr + (step.repeat || 1)
          }, 0)
        : Object.keys(this.test.steps).reduce((nr, key) => {
            const step = this.test.steps[key]
            return nr + (step.repeat || 1)
          }, 0)
    },
    completedSteps() {
      return this.testMessages.filter(message => {
        return message.type === 'pass' || message.type === 'fail'
      }).length
    },
  },
}
</script>

<style></style>
