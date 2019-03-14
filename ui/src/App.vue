<template>
  <div id="app">
    <header>
      <h1>WPE Test Framework 2.0</h1>
    </header>
    <nav>
      <router-link to="/">Dashboard</router-link>
      <router-link to="/testrunner">Test runner</router-link>
    </nav>
    <div id="main">
      <router-view />
    </div>
  </div>
</template>

<style>
html, body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
header {
  background: #eee;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0 8px;
}

header h1 {
  margin: 0;
  padding: 0;
  font-size: 24px;
  line-height: 60px;
}
nav {
  position: absolute;
  top: 60px;
  left: 0;
  bottom: 0;
  background: #f5f6f7;
  width: 200px;
  padding: 8px 0;
}
nav a {
  padding: 2px 8px;
  color: #2c3e50;
  font-weight: bold;
  display: block;
  margin: 16px 0;
  text-decoration: none;
}
nav a:hover {
  text-decoration: underline;
}
#main {
  position: absolute;
  top: 60px;
  left: 200px;
  bottom: 0;
  right: 0;
  overflow: auto;
  padding: 8px;
}
</style>

