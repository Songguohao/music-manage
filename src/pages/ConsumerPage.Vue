<!--后台首页-->
<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <Input class="handle-input" v-model="selectWord" placeholder="请输入用户名"></Input>
        <Button type="primary" @click="centerDialogVisible = true"
          >添加新用户</Button
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
    <Modal v-model="centerDialogVisible" title="添加用户" width="400px" center>
      <Form
        ref="registerForm"
        :model="registerForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="username" label="用户名" size="mini">
          <Input v-model="registerForm.username" placeholder="用户名"></Input>
        </FormItem>
        <FormItem prop="password" label="密码" size="mini">
          <Input v-model="registerForm.password" type="password" placeholder="密码"></Input>
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
        <FormItem prop="phoneNum" label="电话" size="mini">
          <Input v-model="registerForm.phoneNum" placeholder="电话"></Input>
        </FormItem>
        <FormItem prop="email" label="邮箱" size="mini">
          <Input v-model="registerForm.email" placeholder="邮箱"></Input>
        </FormItem>
        <FormItem prop="location" label="地区" size="mini">
          <Input v-model="registerForm.location" placeholder="地区"></Input>
        </FormItem>
        <FormItem prop="introduction" label="个人签名" size="mini">
          <Input
            v-model="registerForm.introduction"
            placeholder="个人签名"
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="centerDialogVisible = false">取消</Button>
        <Button type="primary" @click="addConsumer">确定</Button>
      </div>
    </Modal>
    <Modal v-model="editVisible" title="编辑用户" width="400px" center>
      <Form
        ref="editForm"
        :model="editForm"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="username" label="用户名" size="mini">
          <Input v-model="editForm.username" placeholder="用户名"></Input>
        </FormItem>
        <FormItem prop="password" label="密码" size="mini">
          <Input v-model="editForm.password" type="password" placeholder="密码"></Input>
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
        <FormItem prop="phoneNum" label="电话" size="mini">
          <Input v-model="editForm.phoneNum" placeholder="电话"></Input>
        </FormItem>
        <FormItem prop="email" label="邮箱" size="mini">
          <Input v-model="editForm.email" placeholder="邮箱"></Input>
        </FormItem>
        <FormItem prop="location" label="地区" size="mini">
          <Input v-model="editForm.location" placeholder="地区"></Input>
        </FormItem>
        <FormItem prop="introduction" label="个人签名" size="mini">
          <Input
            v-model="editForm.introduction"
            placeholder="个人签名"
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editVisible = false">取消</Button>
        <Button type="primary" @click="editConsumer">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAllConsumer, setConsumer, updateConsumer, delConsumer } from '../api/index.js'
import { mixin } from '../mixins/index.js'
export default {
  mixins: [mixin],
  name: 'Consumer',
  data () {
    let that = this
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      registerForm: {
        username: '',
        password: '',
        sex: '',
        birth: '',
        phoneNum: '',
        email: '',
        location: '',
        introduction: ''
      },
      editForm: {
        id: '',
        username: '',
        password: '',
        sex: '',
        birth: '',
        phoneNum: '',
        email: '',
        location: '',
        introduction: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
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
        phoneNum: [
          { required: true, message: '电话不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的电子邮箱地址', trigger: ['blur', 'change'] }
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
          title: '用户头像',
          key: 'avatar',
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
                  src: that.getUrl(params.row.avatar)
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
          title: '用户名',
          key: 'username',
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
          title: '电话',
          key: 'phoneNum',
          width: 200,
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'email',
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
    // 查询所有用户
    getData () {
      this.tempData = []
      this.tableData = []
      getAllConsumer().then(res => {
        this.tempData = res.data
        this.tableData = res.data
      })
    },
    // 添加用户
    addConsumer () {
      let d = this.registerForm.birth
      let datetime =
        d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      let params = {
        username: this.registerForm.username,
        password: this.registerForm.password,
        sex: this.registerForm.sex,
        avatar: '/img/avatar/Favorites.png',
        birth: datetime,
        phoneNum: this.registerForm.phoneNum,
        email: this.registerForm.email,
        location: this.registerForm.location,
        introduction: this.registerForm.introduction
      }
      setConsumer(params)
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
      return `${this.$store.state.HOST}/consumer/updateAvatar?id=${id}`
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
    // 删除用户
    handleDelete (id) {
      delConsumer(id)
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
        username: row.username,
        password: row.password,
        sex: (String)(row.sex),
        birth: row.birth,
        phoneNum: row.phoneNum,
        email: row.email,
        location: row.location,
        introduction: row.introduction
      }
    },
    // 保存编辑页面修改的数据
    editConsumer () {
      let params = {
        id: this.editForm.id,
        username: this.editForm.username,
        sex: this.editForm.sex,
        birth: this.editForm.birth,
        phoneNum: this.editForm.phoneNum,
        email: this.editForm.email,
        location: this.editForm.location,
        introduction: this.editForm.introduction
      }
      updateConsumer(params)
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
