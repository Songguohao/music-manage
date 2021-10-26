<!--  -->
<template>
  <div class="song-audio">
    <audio id="player"
    :src= url
    controls = "controls"
    preload="true"
    @canplay="startPlay"
    @ended="ended"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SongAudio',
  data () {
    return {
    }
  },
  created () {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  computed: {
    ...mapGetters([
      'id',
      'url',
      'isPlay'
    ])
  },
  watch: {
    // 监听播放还是暂停状态
    isPlay: function () {
      this.togglePlay()
    }
  },
  methods: {
    // 获取链接后进行播放
    startPlay () {
      let player = document.querySelector('#player')
      player.play()
    },
    ended () {
      this.isPlay = false
    },
    // 开始、暂停
    togglePlay () {
      let player = document.querySelector('#player')
      if (this.isPlay) {
        player.play()
      } else {
        player.pause()
      }
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.song-audio {
  display: inline;
}
</style>
