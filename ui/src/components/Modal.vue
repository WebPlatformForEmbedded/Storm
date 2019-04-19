<template>
  <div
    v-if="active"
    class="flex z-50 fixed pin overflow-auto bg-transparent-black"
    @click="closeModal"
   >
    <div @click.stop="" class="relative bg-white w-full max-w-md m-auto flex-col flex rounded shadow-md min-h-half-screen">
      <h1 v-if="title" v-html="title" class="mb-4 px-4 py-3 text-lg text-dark-blue bg-offwhite rounded-t" />
      <div class="py-4 px-8 mb-16 overflow-auto max-h-80-screen">
        <div v-if="content" v-html="content" class="text-sm leading-normal" />
        <div :is="component" v-if="component" />
      </div>
      <div class="border-t p-3 flex justify-end bg-offwhite rounded-b pr-8 absolute pin-b w-full">
        <button 
          @click="cancel"
          class="ml-3 bg-light-grey hover:bg-dark-grey text-dark-grey hover:text-white text-xs font-bold p-2 rounded focus:outline-none min-w-4"
        >Cancel</button>
        <button
          @click="ok"
          class="ml-3 bg-blue hover:bg-dark-blue text-white text-xs font-bold p-2 rounded focus:outline-none min-w-4"
        >Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Modal',
  computed: {
    ...mapState({
      active: state => state.modal.active,
      component: state => state.modal.component,
      content: state => state.modal.content,
      title: state => state.modal.title,
      context: state => state.modal.context,
    })
  },
  methods: {
    closeModal() {
      this.$store.commit('CLOSE_MODAL')    
    },
    cancel() {
      // todo: execute cancelAction if it exists
      this.closeModal()
    },
    ok() {
      // todo: execute okAction if it exists
      this.closeModal()
    }
  }
}
</script>

<style>
</style>
