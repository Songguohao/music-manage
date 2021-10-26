<!--后台首页-->
<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <Input class="handle-input" v-model="selectWord" placeholder="请输入歌手名"></Input>
        <Button type="primary" @click="centerDialogVisible = true"
          >添加歌手</Button
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
    <Modal v-model="centerDialogVisible" title="添加歌手" width="400px" center>
      <Form
        ref="registerForm"
        :model="registerForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="name" label="歌手名" size="mini">
          <Input v-model="registerForm.name" placeholder="歌手名"></Input>
        </FormItem>
        <FormItem prop="sex" label="性别" size="mini">
          <RadioGroup v-model="registerForm.sex">
            <Radio label="0">女</Radio>
            <Radio label="1">男</Radio>
            <Radio label="3">组合</Radio>
            <Radio label="4">未知</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="出生日期" size="mini">
          <Row>
            <Col span="11">
              <FormItem prop="birth">
                <DatePicker
                  type="date"
                  placeholder="请选择出生日期"
                  v-model="registerForm.birth"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="location" label="地区" size="mini">
          <Input v-model="registerForm.location" placeholder="地区"></Input>
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
        <Button type="primary" @click="addSinger">确定</Button>
      </div>
    </Modal>
    <Modal v-model="editVisible" title="编辑歌手" width="400px" center>
      <Form
        ref="editForm"
        :model="editForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="name" label="歌手名" size="mini">
          <Input v-model="editForm.name" placeholder="歌手名"></Input>
        </FormItem>
        <FormItem prop="sex" label="性别" size="mini">
          <RadioGroup v-model="editForm.sex">
            <Radio label="0">女</Radio>
            <Radio label="1">男</Radio>
            <Radio label="3">组合</Radio>
            <Radio label="4">未知</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="出生日期" size="mini">
          <Row>
            <Col span="11">
              <FormItem prop="birth">
                <DatePicker
                  type="date"
                  placeholder="请选择出生日期"
                  v-model="editForm.birth"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="location" label="地区" size="mini">
          <Input v-model="editForm.location" placeholder="地区"></Input>
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
        <Button type="primary" @click="editSinger">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAllSinger, setSinger, updateSinger, delSinger } from '../api/index.js'
import { mixin } from '../mixins/index.js'
export default {
  mixins: [mixin],
  name: 'Singer',
  data () {
    let that = this
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      registerForm: {
        name: '',
        sex: '',
        birth: '',
        location: '',
        introduction: ''
      },
      editForm: {
        id: '',
        name: '',
        sex: '',
        birth: '',
        location: '',
        introduction: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '歌手姓名不能为空', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        date: [
          {
            required: true,
            type: 'date',
            message: '请选择出生日期',
            trigger: 'change'
          }
        ],
        location: [
          { required: true, message: '地区不能为空', trigger: 'blur' }
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
          title: '歌手图片',
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
          title: '歌手',
          key: 'name',
          width: 200,
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          width: 200,
          align: 'center',
          render: (h, params) => {
            switch (params.row.sex) {
              case 0:
                return h('span', '女')
              case 1:
                return h('span', '男')
              case 2:
                return h('span', '不明')
              case 3:
                return h('span', '组合')
            }
          }
        },
        {
          title: '出生日期',
          key: 'birth',
          width: 200,
          align: 'center'
        },
        {
          title: '地区',
          key: 'location',
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
                    this.songEdit(params.row.id, params.row.name)
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
    }
  },
  methods: {
    // 查询所有歌手
    getData () {
      this.tempData = []
      this.tableData = []
      getAllSinger().then(res => {
        this.tempData = res.data
        this.tableData = res.data
      })
    },
    // 添加歌手
    addSinger () {
      let d = this.registerForm.birth
      let datetime =
        d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      let params = {
        name: this.registerForm.name,
        sex: this.registerForm.sex,
        img: '/img/singerPic/Favorites.png',
        birth: datetime,
        location: this.registerForm.location,
        introduction: this.registerForm.introduction
      }
      setSinger(params)
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
      return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`
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
    // 删除歌手
    handleDelete (id) {
      delSinger(id)
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
        name: row.name,
        sex: (String)(row.sex),
        birth: row.birth,
        location: row.location,
        introduction: row.introduction
      }
    },
    // 保存编辑页面修改的数据
    editSinger () {
      let params = {
        id: this.editForm.id,
        name: this.editForm.name,
        sex: this.editForm.sex,
        img: this.editForm.img,
        birth: this.editForm.birth,
        location: this.editForm.location,
        introduction: this.editForm.introduction
      }
      updateSinger(params)
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
      this.$router.push({path: `/Song`, query: {id, name}})
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
