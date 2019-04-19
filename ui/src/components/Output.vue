<template>  
  <div class="border p-4 rounded bg-white overflow-auto h-64">
    <ul class="list-reset">
      <li class="py-2 border-b items-center flex" v-for="(message, index) in messages" :key="index">
        <span
          class="flex w-8 text-lg"
          v-html="emoticon(message.type)"
        />
        <span class="flex text-sm text-dark-grey">
          {{message.payload && message.payload.message}}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Output',
  props: {
    messages: {
      type: Array,
    }
  },
  methods: {
    emoticon(type) {
      const map = {
        'message': '➡️',
        'pass': '✅',
        'fail': '❌',
        'success': '👍',
        'error': '😭',
        'done': '🎉'
      }

      return map[type] || map.message
    }
  }
}
</script>

<style>
</style>
