<template>  
  <div class="output">
    <ul>
      <li v-for="(message, index) in messages" :key="index">{{message}}</li>
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
.output {
    background: #eee;
    border-radius: 10px;
    color: #333;
    height: 150px;
    width: 90%;
    border: solid 2px #ccc;
    font-size: 14px;
    text-align: left;
    margin: 20px 5%;
    overflow: auto;
}
</style>
