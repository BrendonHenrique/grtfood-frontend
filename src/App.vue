<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script> 
import Vue from 'vue';
Vue.prototype.$eventBus = new Vue();  
export default {
  name: 'App',
}
</script>
