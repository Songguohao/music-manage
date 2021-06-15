<template>
  <div class="header">
    <!-- 折叠图片 -->
    <div class="collapse-btn">
      <Icon
        type="ios-apps"
        style="color: white"
        @click.native="collapseChange"
      />
    </div>
    <div class="logo">music后台管理</div>
    <div class="header-right">
      <div class="btn-fullscreen" @click="handleFullScreen">
        <Tooltip :content="fullscreen ? '取消全屏' : '全屏'">
          <Icon type="md-contract" />
        </Tooltip>
      </div>
      <div class="user-avator">
        <img src="../assets/img/user.jpg" />
      </div>
      <Dropdown class="user-name" trigger="click" style="margin-left: 20px">
        <a href="javascript:void(0)">
          <span class="dropdown-link">{{userName}}</span>
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="logout">退出登陆</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import bus from '@/assets/js/bus'
export default {
  name: 'TheHeader',
  data () {
    return {
      collapse: false,
      fullscreen: false
    }
  },
  computed: {
    userName () {
      return localStorage.getItem('userName')
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  methods: {
    collapseChange () {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    logout () {
      localStorage.removeItem('userName')
      this.$router.push('/')
    },
    handleFullScreen () {
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullScreen) {
          document.msExitFullScreen()
        }
      } else {
        let element = document.documentElement
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (document.webkitRequestFullScreen) {
          document.webkitRequestFullScreen()
        } else if (document.mozRequestFullScreen) {
          document.mozRequestFullScreen()
        } else if (document.msRequestFullScreen) {
          document.msRequestFullScreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fffff;
}
.header .logo {
  position: relative;
  float: left;
  line-height: 70px;
  color: white;
}
.header-right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 70px;
  align-items: center;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  color: white;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-name {
  margin-left: 10px;
}

.dropdown-link {
  color: white;
  cursor: pointer;
  font-size: 16px;
}

</style>
