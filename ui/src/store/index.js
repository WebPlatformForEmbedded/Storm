import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    device: null,
    tests: [],
    messages: [],
    modal: {
      active: false,
      component: null,
      content: null,
      title: null,
      context: null,
    },
  },
  mutations: {
    SET_DEVICE(state, payload) {
      state.device = payload
    },
    SET_TESTS(state, payload) {
      state.tests = payload
    },
    CLEAR_MESSAGES(state) {
      state.messages = []
    },
    ADD_MESSAGE(state, payload) {
      state.messages.unshift(payload)
    },
    OPEN_MODAL(state, payload) {
      state.modal.active = true
      if (payload.component) {
        state.modal.component = payload.component
      }
      if (payload.content) {
        state.modal.content = payload.content
      }
      if (payload.title) {
        state.modal.title = payload.title
      }
      if (payload.context) {
        state.modal.context = payload.context
      }
    },
    CLOSE_MODAL(state, payload) {
      state.modal = {
        active: false,
        component: null,
        content: null,
        title: null,
        context: null,
      }
    },
  },
  actions: {},
})
