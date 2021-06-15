<template>
  <div>
    <the-header></the-header>
    <the-aside></the-aside>
    <div class="content-box" :class="{'content-collapse': collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheAside from '@/components/TheAside'
import TheHeader from '@/components/TheHeader'
import bus from '@/assets/js/bus'
import '../assets/css/main.css'

export default {
  name: 'Home',
  components: {
    TheAside,
    TheHeader
  },
  data () {
    return {
      collapse: false
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {}
}
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
