<template>  
  <div>
    <div class="w-full border-b border-light-grey mb-4 pb-2 flex" v-for="(test, index) in tests" :key="'test' + index">
        <div class="w-3/5">
          <h2 class="text-base text-black w-full mb-2">{{test.title}}</h2>
          <p class="text-sm text-dark-grey mb-2">{{test.description}}</p>
          <p class="text-sm text-dark-grey mb-2">
            <span
              class="cursor-pointer underline"
              @click="openTestDetailsModal(test)"
            >
              <span class="font-bold">{{test.steps.length}}</span> steps
            </span>
          </p>
        </div>
        <div class="w-2/5 text-right">
          <button 
            class="ml-2 bg-blue hover:bg-dark-blue text-white text-xs font-bold p-2 rounded focus:outline-none"
            @click="selectOrUnselectTest(test)"
            v-text="selected(test) ? 'Unselect' : 'Select'"
          />
      </div>
    </div>
  </div>
</template>

<script>
import Tests from '../../../tests'

export default {
  name: 'TestChooser',
  computed: {
    tests: () => Tests,
    selectedTests() {
      return this.$store.state.tests
    }
  },
  methods: {
    selected(test) {
      const selected = this.selectedTests.find(t => t === test)
      return !!selected
    },
    selectOrUnselectTest(test) {
      const tests = this.selectedTests

      if(this.selected(test)) {
        const index = tests.indexOf(test)
        tests.splice(index, 1)
      } 
      else {
        tests.push(test)
      }

      this.$store.commit('SET_TESTS', tests)
    },
    openTestDetailsModal(test) {
      this.$store.commit('OPEN_MODAL', {
        title: 'Test details - <em> ' + test.title + ' </em>',
      })
    }
  }
}
</script>

<style>
</style>
