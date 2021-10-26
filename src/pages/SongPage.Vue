<!--后台首页-->
<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <Input class="handle-input" v-model="selectWord" placeholder="请输入歌曲名"></Input>
        <Button type="primary" @click="centerDialogVisible = true"
          >添加歌曲</Button
        >
        <Button type="error" @click="delAll"
          >批量删除</Button
        >
        <Table
          style="margin-top: 30px"
          size="small"
          border
          width="100%"
          height="1144px"
          :columns="tableColumns"
          :data="data"
          @on-selection-change="handleSelectionChange"
        ></Table>
        <div class="pagination">
          <Page :current.sync="currentPage" :page-size="pageSize" :total="tableData.length" show-elevator @on-change="handleCurrentChange" v-if="tableData.length != 0"></Page>
        </div>
      </div>
    </div>
    <Modal v-model="centerDialogVisible" title="添加歌曲" width="400px" center>
      <Form
        ref="registerForm"
        :model="registerForm"
        :rules="ruleValidate"
        :label-width="80"
        id="tf"
      >
        <FormItem prop="name" label="歌曲名" size="mini">
          <Input v-model="registerForm.name" placeholder="歌曲名"></Input>
        </FormItem>
        <FormItem prop="introduction" label="专辑" size="mini">
          <Input v-model="registerForm.introduction" placeholder="专辑"></Input>
        </FormItem>
        <FormItem prop="lyric" label="歌词" size="mini">
          <Input
            v-model="registerForm.lyric"
            placeholder="歌词"
            type="textarea"
          ></Input>
        </FormItem>
        <FormItem prop="url" label="歌曲上传">
          <input type="file" name="file"></input>
        </FormItem>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="centerDialogVisible = false">取消</Button>
        <Button type="primary" @click="addSong">确定</Button>
      </div>
    </Modal>
    <Modal v-model="editVisible" title="编辑歌曲" width="400px" center>
            <Form
        ref="editForm"
        :model="editForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="name" label="歌曲名" size="mini">
          <Input v-model="editForm.name" placeholder="歌曲名"></Input>
        </FormItem>
        <FormItem prop="introduction" label="专辑" size="mini">
          <Input v-model="editForm.introduction" placeholder="专辑"></Input>
        </FormItem>
        <FormItem prop="lyric" label="歌词" size="mini">
          <Input
            v-model="editForm.lyric"
            placeholder="歌词"
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="centerDialogVisible = false">取消</Button>
        <Button type="primary" @click="editSong">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { updateSong, delSong, songOfSingerId } from '../api/index.js'
import { mixin } from '../mixins/index.js'
import { mapGetters } from 'vuex'
import '@/assets/js/iconfont.js'
export default {
  mixins: [mixin],
  name: 'Song',
  data () {
    let that = this
    return {
      singerId: '', // 歌手id
      singerName: '', // 歌手名
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      toggle: false, // 播放器的显示图标状态
      registerForm: {
        name: '',
        singerName: '',
        introduction: '',
        lyric: ''
      },
      editForm: {
        id: '',
        name: '',
        introduction: '',
        lyric: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '歌手姓名不能为空', trigger: 'blur' }
        ],
        introduction: [{ required: true, message: '专辑不能为空', trigger: 'blur' }],
        lyric: [{ required: false, trigger: 'blur' }]
      },
      tableData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '歌曲图片',
          key: 'img',
          width: 200,
          align: 'center',
          render (h, params) {
            return h('div', [
              h('img', {
                style: {
                  width: '100%',
                  height: '160px',
                  'border-radius': '5px',
                  'margin-top': '10px',
                  overflow: 'hidden'
                },
                attrs: {
                  src: that.getUrl(params.row.img)
                }
              }),
              h('div', {
                style: {
                  position: 'relative',
                  'z-index': '100',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                  cursor: 'pointer',
                  top: '-110px',
                  left: '70px'
                }
              }, [
                h('Icon', {
                  style: {
                    'color': '#2d8cf0',
                    'font-size': '40px'
                  },
                  attrs: {
                    type: that.toggle === params.row.name ? 'ios-pause' : 'ios-play'
                  },
                  on: {
                    click: () => {
                      that.setSongUrl(params.row.url, params.row.name)
                    }
                  }
                })
              ]),
              h('Upload', {
                props: {
                  'show-upload-list': false,
                  format: ['jpg', 'jpeg', 'png'],
                  action: that.uploadUrl(params.row.id),
                  'on-success': that.handleImgSuccess,
                  'before-upload': that.handleUploadPre
                }
              }, [
                h('Button', {
                  style: {
                    'margin-bottom': '10px'
                  },
                  props: {
                    icon: 'ios-cloud-upload-outline',
                    size: 'small'
                  }
                }, '上传图片')
              ])
            ])
          }
        },
        {
          title: '歌名',
          key: 'name',
          width: 200,
          align: 'center'
        },
        {
          title: '专辑',
          key: 'introduction',
          width: 200,
          align: 'center'
        },
        {
          title: '歌词',
          key: 'lyric',
          width: 500,
          align: 'center',
          render: (h, params) => {
            return h('ul', {style: { 'height': '220px', 'overflow': 'auto' }}, that.parseLyric(params.row.lyric).map(item => h('li', {style: {'list-style-type': 'none'}}, item)))
          }
        },
        {
          title: '歌曲管理',
          key: 'songEidt',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Upload', {
                props: {
                  'show-upload-list': false,
                  action: that.uploadSongUrl(params.row.id),
                  'on-success': that.handleSongSuccess,
                  'before-upload': that.beforeSongUpload
                }
              }, [
                h('Button', {
                  style: {
                    'margin-bottom': '10px'
                  },
                  props: {
                    icon: 'ios-cloud-upload-outline',
                    size: 'small'
                  }
                }, '上传歌曲')
              ])
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  title: '确定删除吗？',
                  transfer: true,
                  confirm: true
                },
                on: {
                  'on-ok': () => {
                    that.handleDelete(params.row.id)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                }, '删除')
              ])
            ])
          }
        }
      ],
      tempData: [],
      selectWord: '',
      pageSize: 5, // 分页每页大小
      currentPage: 1, // 当前页
      multipleSelection: [] // 哪些项已经打钩
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {
    this.singerId = this.$route.query.id
    this.singerName = this.$route.query.name
    this.getData()
    this.currentPage = this.getContextData('currentPage') || 1
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  destroyed () {
    this.$store.commit('setIsPlay', false)
  },
  watch: {
    // 搜索框里面的内容发送变化的时候，搜索结果table列表的内容跟着它的内容发生变化
    selectWord: function () {
      if (this.selectWord === '') {
        this.tableData = this.tempData
      } else {
        this.tableData = []
        for (let item of this.tempData) {
          if (item.name.includes(this.selectWord)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  computed: {
    // 计算当前搜索结果表里的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    ...mapGetters([
      'id',
      'url',
      'isPlay'
    ])
  },
  methods: {
    // 查询所有歌曲
    getData () {
      this.tempData = []
      this.tableData = []
      songOfSingerId(this.$route.query.id).then(res => {
        this.tempData = res.data
        this.tableData = res.data
      })
    },
    // 添加歌曲
    addSong () {
      let that = this
      let lyric = that.registerForm.lyric ? that.registerForm.lyric : '[00:00:00]暂无歌词'
      var form = new FormData(document.getElementById('tf'))
      form.append('singerId', that.singerId)
      form.set('introduction', that.registerForm.introduction)
      form.set('name', that.registerForm.name)
      form.set('lyric', lyric)
      var req = new XMLHttpRequest()
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          let res = JSON.parse(req.response)
          if (res.code === 1) {
            that.getData()
            that.registerForm = {}
            that.$Notice.success({
              title: '添加成功'
            })
          } else {
            that.$Notice.success({
              title: '添加成功'
            })
          }
        }
      }
      req.open('post', `${this.$store.state.HOST}/song/add`, false)
      req.send(form)
      this.$refs.registerForm.resetFields()
      that.centerDialogVisible = false
    },
    // 更新歌曲图片
    uploadUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },
    // 上传图片之前校验
    handleUploadPre (file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!isJPG) {
        this.$Notice.error({
          itle: '上传图片只能是jpg或png格式'
        })
        return false
      }
      const isLT2M = file.size / 1024 / 1024 < 2
      if (!isLT2M) {
        this.$Notice.error({
          itle: '上传图片不能超过2MB'
        })
        return false
      }
      return true
    },
    // 上传图片成功之后
    handleImgSuccess (res, file) {
      let that = this
      if (res.code === 1) {
        that.getData()
        that.$Message.success('图片上传成功!')
      }
    },
    // 上传歌曲之前校验
    beforeSongUpload (file) {
      var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      console.log(testMsg)
      if (testMsg !== 'mp3') {
        this.$Message.error('上传文件只能是mp3格式')
        return false
      }
      return true
    },
    // 上传歌曲成功之后
    handleSongSuccess (res, file) {
      let that = this
      if (res.code === 1) {
        that.getData()
        that.$Message.success('歌曲上传成功!')
      }
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.setContextData('currentPage', this.currentPage)
    },
    // 删除歌曲
    handleDelete (id) {
      delSong(id)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.$Notice.success({
              title: '删除成功'
            })
          } else {
            this.$Notice.error({
              title: '删除失败'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 弹出编辑页面
    handleEdit (row) {
      console.log(row)
      this.editVisible = true
      this.editForm = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric: row.lyric
      }
    },
    // 保存编辑页面修改的数据
    editSong () {
      let params = {
        id: this.editForm.id,
        name: this.editForm.name,
        introduction: this.editForm.introduction,
        lyric: this.editForm.lyric
      }
      updateSong(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.$Notice.success({
              title: '编辑成功'
            })
          } else {
            this.$Notice.error({
              title: '编辑失败'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.editVisible = false
    },
    // 更新歌曲url
    uploadSongUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
    },
    // 解析歌词
    parseLyric (text) {
      let lines = text.split('\n')
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g
      let result = []
      for (let item of lines) {
        let value = item.replace(pattern, '')
        result.push(value)
      }
      return result
    },
    // 切换播放
    setSongUrl (url, name) {
      // this.toggle = name
      // this.$store.commit('setUrl', this.$store.state.HOST + url)
      // if (this.isPlay) {
      //   this.$store.commit('setIsPlay', false)
      // } else {
      //   this.$store.commit('setIsPlay', true)
      // }
      if (this.toggle === name) {
        this.toggle = false
        this.$store.commit('setIsPlay', false)
      } else {
        this.toggle = name
        this.$store.commit('setUrl', this.$store.state.HOST + url)
        this.$store.commit('setIsPlay', true)
      }
    }
  }
}
</script>

<style>
.handle-box {
  margin-bottom: 20px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
