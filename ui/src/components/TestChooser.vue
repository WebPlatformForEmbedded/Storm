<template>  
  <div>
       <div class="w-full border-b border-light-grey mb-4 pb-2 flex" v-for="(test, index) in tests" :key="'test' + index">
           <div class="w-3/5">
            <h2 class="text-base text-black w-full mb-2">{{test.title}}</h2>
            <p class="text-sm text-dark-grey mb-2">{{test.description}}</p>
            <p class="text-sm text-dark-grey mb-2">
                <span class="font-bold">{{test.steps.length}}</span> steps
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
  data: () =>({
    selectedTests: []
  }),
  computed: {
    tests: () => Tests,
  },
  methods: {
      selected(test) {
          const selected = this.selectedTests.find(t => t === test)
          return !!selected
      },
      selectOrUnselectTest(test) {
          this.selected(test) ? 
            this.selectedTests = this.selectedTests.filter(t => {
                return t !== test
            }) :
            this.selectedTests.push(test)

            this.$store.commit('SET_TESTS', this.selectedTests)
      }
  }
}
</script>

<style>
</style>
