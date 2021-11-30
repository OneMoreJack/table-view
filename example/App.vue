<template>
  <div id="app">
    <div class="nav">
      <template v-for="(route, index) in routes">
        <span :key="route.name">
          <router-link 
            :to="route.path"
          >{{route.name}}</router-link>
          <span v-if="index < routes.length - 1"> | </span>
        </span>
      </template>
    </div>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
import { routes } from '@/router'

export default {
  name: 'APP', 

  data() {
    return {
      routes
    }
  }
}
</script>


<style lang="scss">
* { 
  margin: 0; 
  box-sizing: border-box;
}

.nav {
  text-align: center;
  padding: 30px;
  border-bottom: 1px solid lightgray;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.main {
  width: 100vw;
}
</style>
