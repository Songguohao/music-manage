<template>
  <div class="sidebar">
    <Sider
      ref="side"
      class="sidebar-menu"
      width="150px"
      collapsible
      :collapsed-width="65"
      v-model="collapse"
    >
      <Menu theme="dark" :active-name="defaultItem" width="155px">
        <template v-for="(item, index) in items">
          <MenuItem :name="item.index" :to="item.index" :key="index">
            <Icon :type="item.icon" :key="index"></Icon>
            {{ item.title }}
          </MenuItem>
        </template>
      </Menu>
    </Sider>
  </div>
</template>

<script>
import bus from '@/assets/js/bus'
export default {
  name: 'TheAside',
  data () {
    return {
      collapse: false, // 菜单折叠：默认为否
      items: [
        {
          icon: 'ios-document',
          index: 'Info',
          title: '系统首页'
        },
        {
          icon: 'ios-document',
          index: 'Consumer',
          title: '用户管理'
        },
        {
          icon: 'ios-document',
          index: 'Singer',
          title: '歌手管理'
        },
        {
          icon: 'ios-document',
          index: 'SongList',
          title: '歌单管理'
        }
      ]
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {
    // 通过bus进行组件间的通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  watch: {
    collapse: {
      handler (newName, oldName) {
        bus.$emit('collapse', this.collapse)
      }
    }
  },
  computed: {
    // 默认打开的子菜单
    defaultItem () {
      return this.items[0].index
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  background-color: #334256;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0px;
}

.sidebar > ul {
  height: 100%;
}

</style>
