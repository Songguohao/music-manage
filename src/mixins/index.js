export const mixin = {
  methods: {
    // 根据相对地址获取绝对地址
    getUrl (url) {
      return this.$store.state.HOST + url
    },
    changeSex (value) {
      if (value === 0) {
        return '女'
      }
      if (value === 1) {
        return '男'
      }
      if (value === 2) {
        return '组合'
      }
      if (value === 3) {
        return '不明'
      }
      return value
    },
    // 把已经选择的项赋值给multipleSelection
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 批量删除已经选择的项
    delAll () {
      for (let item of this.multipleSelection) {
        this.handleDelete(item.id)
      }
      this.multipleSelection = []
    },
    // 给sessionStorage存值
    setContextData: function (key, value) {
      if (typeof value === 'string') {
        sessionStorage.setItem(key, value)
      } else {
        sessionStorage.setItem(key, JSON.stringify(value))
      }
    },
    // 从sessionStorage取值
    getContextData: function (key) {
      const str = sessionStorage.getItem(key)
      if (typeof str === 'string') {
        try {
          return JSON.parse(str)
        } catch (e) {
          return str
        }
      }
    }
  }
}
