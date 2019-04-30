<template>
  <div class="max-w-xl">
    <h1 class="text-xl mb-8">Test runner</h1>

    <div class="w-full border-b border-light-grey flex pb-4 mb-4">
      <div class="flex-shrink mr-16">
        <span
          class="rounded-full h-12 w-12 flex items-center justify-center bg-white border border-light-grey text-dark-blue text-xl font-bold"
        >
          1
        </span>
      </div>
      <div class="w-3/5 flex-auto">
        <DeviceChooser />
      </div>
    </div>

    <div v-if="device" class="w-full border-b border-light-grey flex pb-4 mb-4">
      <div class="flex-shrink mr-16">
        <span
          class="rounded-full h-12 w-12 flex items-center justify-center bg-white border border-light-grey text-dark-blue text-xl font-bold"
        >
          2
        </span>
      </div>
      <div class="w-3/5 flex-auto">
        <TestChooser />
      </div>
    </div>

    <div v-if="device && tests.length" class="w-full border-b border-light-grey flex pb-4 mb-4">
      <div class="flex-shrink mr-16">
        <span
          class="rounded-full h-12 w-12 flex items-center justify-center bg-white border border-light-grey text-dark-blue text-xl font-bold"
        >
          3
        </span>
      </div>
      <div class="w-3/5 flex-auto">
        <TestRunner />
      </div>
    </div>
  </div>
</template>

<script>
import DeviceChooser from '@/components/DeviceChooser.vue'
import TestChooser from '@/components/TestChooser.vue'
import TestRunner from '@/components/TestRunner.vue'

export default {
  name: 'Testrunner',
  components: {
    DeviceChooser,
    TestChooser,
    TestRunner,
  },
  data() {
    return {
      ip: null,
    }
  },
  computed: {
    device() {
      return this.$store.state.device
    },
    tests() {
      return this.$store.state.tests
    },
  },
}
</script>

<style></style>
