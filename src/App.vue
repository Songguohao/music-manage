<template>
  <div id="app">
    <SongAudio v-show="false" />
    <router-view />
  </div>
</template>

<script>
import SongAudio from '@/components/SongAudio'
export default {
  name: 'App',
  components: {
    SongAudio
  }
}
</script>

<style>
#app {
}
</style>
