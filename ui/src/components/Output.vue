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

<style scoped>
.output {
    background: #eee;
    border-radius: 10px;
    color: #333;
    height: 200px;
    width: 100%;
    border: solid 2px #ccc;
    font-size: 14px;
    text-align: left;
    overflow: auto;
    padding: 8px 24px;
    box-sizing: border-box;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
ul li {
  padding: 0;
  padding-bottom: 6px;
  margin: 0;
}

</style>
