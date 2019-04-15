<template>  
  <div class="border p-4 rounded bg-white overflow-auto h-64">
    <ul class="list-reset">
      <li class="py-2 border-b text-base" v-for="(message, index) in messages" :key="index">{{message}}</li>
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
  }
}
</script>

<style>
</style>
