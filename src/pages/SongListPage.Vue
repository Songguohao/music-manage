<!--后台首页-->
<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <Input class="handle-input" v-model="selectWord" placeholder="请输入标题"></Input>
        <Button type="primary" @click="centerDialogVisible = true"
          >添加歌单</Button
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
    <Modal v-model="centerDialogVisible" title="添加歌单" width="400px" center>
      <Form
        ref="registerForm"
        :model="registerForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="title" label="标题" size="mini">
          <Input v-model="registerForm.title" placeholder="标题"></Input>
        </FormItem>
        <FormItem prop="style" label="风格" size="mini">
          <Input v-model="registerForm.style" placeholder="风格"></Input>
        </FormItem>
        <FormItem prop="introduction" label="简介" size="mini">
          <Input
            v-model="registerForm.introduction"
            placeholder="简介"
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="centerDialogVisible = false">取消</Button>
        <Button type="primary" @click="addSongList">确定</Button>
      </div>
    </Modal>
    <Modal v-model="editVisible" title="编辑歌单" width="400px" center>
      <Form
        ref="editForm"
        :model="editForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="title" label="标题" size="mini">
          <Input v-model="editForm.title" placeholder="标题"></Input>
        </FormItem>
        <FormItem prop="style" label="风格" size="mini">
          <Input v-model="editForm.style" placeholder="风格"></Input>
        </FormItem>
        <FormItem prop="introduction" label="简介" size="mini">
          <Input
            v-model="editForm.introduction"
            placeholder="简介"
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editVisible = false">取消</Button>
        <Button type="primary" @click="editSongList">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAllSongList, setSongList, updateSongList, delSongList } from '../api/index.js'
import { mixin } from '../mixins/index.js'
export default {
  mixins: [mixin],
  name: 'SongList',
  data () {
    let that = this
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      registerForm: {
        title: '',
        style: '',
        introduction: ''
      },
      editForm: {
        title: '',
        style: '',
        introduction: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        style: [
          { required: true, message: '风格不能为空', trigger: 'blur' }
        ],
        introduction: [{ required: false, trigger: 'blur' }]
      },
      tableData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '歌单图片',
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
                  'margin-bottom': '10px',
                  overflow: 'hidden'
                },
                attrs: {
                  src: that.getUrl(params.row.img)
                }
              }),
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
          title: '标题',
          key: 'title',
          width: 200,
          align: 'center'
        },
        {
          title: '风格',
          key: 'style',
          width: 200,
          align: 'center'
        },
        {
          title: '简介',
          key: 'introduction',
          width: 200,
          align: 'center'
        },
        {
          title: '歌曲管理',
          key: 'songEidt',
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
                    this.songEdit(params.row.id)
                  }
                }
              }, '歌曲管理')
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
                    that.handleEdit(params.row)
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
    this.getData()
    this.currentPage = this.getContextData('currentPage') || 1
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  watch: {
    // 搜索框里面的内容发送变化的时候，搜索结果table列表的内容跟着它的内容发生变化
    selectWord: function () {
      if (this.selectWord === '') {
        this.tableData = this.tempData
      } else {
        this.tableData = []
        for (let item of this.tempData) {
          if (item.title.includes(this.selectWord)) {
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
    }
  },
  methods: {
    // 查询所有歌单
    getData () {
      this.tempData = []
      this.tableData = []
      getAllSongList().then(res => {
        this.tempData = res.data
        this.tableData = res.data
      })
    },
    // 添加歌单
    addSongList () {
      let params = {
        title: this.registerForm.title,
        img: '/img/songListPic/gedan.jpg',
        style: this.registerForm.style,
        introduction: this.registerForm.introduction
      }
      setSongList(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.$Notice.success({
              title: '添加成功'
            })
          } else {
            this.$Notice.error({
              title: '添加失败'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.$refs.registerForm.resetFields()
      this.centerDialogVisible = false
    },
    // 更新头像
    uploadUrl (id) {
      return `${this.$store.state.HOST}/songList/updateSongListPic?id=${id}`
    },
    // 上传图片之前校验
    handleUploadPre (file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!isJPG) {
        this.$Message.error('上传头像图片只能是jpg或png格式')
        return false
      }
      const isLT2M = file.size / 1024 / 1024 < 2
      if (!isLT2M) {
        this.$Message.error('上传头像图片不能超过2MB')
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
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.setContextData('currentPage', this.currentPage)
    },
    // 删除歌单
    handleDelete (id) {
      delSongList(id)
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
      this.editVisible = true
      this.editForm = {
        id: row.id,
        title: row.title,
        style: row.style,
        introduction: row.introduction
      }
    },
    // 保存编辑页面修改的数据
    editSongList () {
      let params = {
        id: this.editForm.id,
        title: this.editForm.title,
        style: this.editForm.style,
        introduction: this.editForm.introduction
      }
      updateSongList(params)
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
    // 转向歌曲管理页面
    songEdit (id, name) {
      this.$router.push({path: `/ListSong`, query: {id}})
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
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
