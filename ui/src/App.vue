<template>
  <div id="app" class="h-screen v-screen bg-grey-lightest">
    <header class="bg-black px-2 h-12 w-full z-30 pin-t flex flex-wrap content-center shadow-md fixed">
      <h1 class="text-xl text-offwhite">WPE Test Framework 2.0</h1>
    </header>
    <div class="flex flex-row fixed mt-12 pin-b pin-t w-full">
      <nav class="bg-white h-full z-10 w-48 pt-6 pr-4 overflow-auto">
        <ul class="list-reset">
          <li
            v-for="navItem in navItems"
            :key="navItem.path"
            class="full mb-3 flex "
          >
            <router-link
              :to="navItem.path"
              class="hover:bg-light-blue text-black rounded-r-full p-3 text-sm w-full no-underline"
              active-class="bg-light-blue text-dark-blue font-bold"
            >
              {{navItem.label}}
            </router-link>
          </li>
        </ul>
      </nav>
      <main class="flex-1 bg-offwite p-6 overflow-auto w-full z-20 border-l border-light-grey">
        <router-view />
      </main>
    </div>
    <Modal />
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue'

export default {
  name: 'App',
  components: {
    Modal,
  },
  data: () => ({
    navItems: [{
      path: '/dashboard',
      label: 'Dashboard'
    },{
      path: '/testrunner/',
      label: 'Test runner'
    }
    // ,{
    //   path: '/results/',
    //   label: 'Test results'
    // }
    ]
  })
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
