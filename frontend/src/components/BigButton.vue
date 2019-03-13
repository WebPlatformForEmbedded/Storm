<template>  
  <button @click="click">Start</button>
</template>

<script>

export default {
  name: 'BigButton',
  props: {
    callback: {
        type: Function,
    }
  },
  methods: {
    click() {
      if(this.callback) {
        this.callback.apply()
      }
      else {
        console.log('No callback defined')
      }
    }
  }
}
</script>

<style>
button {
    background: green;
    border-radius: 20px;
    color: #fff;
    height: 40px;
    width: 100px;
    border: none;
    font-size: 16px;
    font-weight: bold;
    outline: none;
    cursor: pointer;
}
</style>
