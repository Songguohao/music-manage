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
        <FormItem prop="singerName" label="歌手名" size="mini">
          <Input v-model="registerForm.singerName" placeholder="歌手名"></Input>
        </FormItem>
        <FormItem prop="songName" label="歌曲名" size="mini">
          <Input v-model="registerForm.songName" placeholder="歌曲名"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="centerDialogVisible = false">取消</Button>
        <Button type="primary" @click="getSongId">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { setListSong, delListSong, listSongDetail, songVOOfSongId, songOfSongName } from '../api/index.js'
import { mixin } from '../mixins/index.js'
import '@/assets/js/iconfont.js'
export default {
  mixins: [mixin],
  name: 'ListSong',
  data () {
    let that = this
    return {
      songListId: '',
      centerDialogVisible: false, // 添加弹窗是否显示
      registerForm: {
        singerName: '',
        songName: ''
      },
      ruleValidate: {
        singerName: [
          { required: true, message: '歌手名不能为空', trigger: 'blur' }
        ],
        songName: [{ required: true, message: '歌曲名不能为空', trigger: 'blur' }]
      },
      tableData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '歌曲名',
          key: 'name',
          width: 200,
          align: 'center'
        },
        {
          title: '歌手名',
          key: 'singerName',
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
    this.songListId = this.$route.query.id
    this.getData()
    this.currentPage = this.getContextData('currentPage') || 1
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  destroyed () {
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
    }
  },
  methods: {
    // 根据歌曲id查询歌曲对象，放到tableData和tempData里
    getSong (id) {
      songVOOfSongId(id).then(res => {
        this.tempData.push(res.data)
        this.tableData.push(res.data)
      })
    },
    // 查询所有歌曲
    getData () {
      this.tempData = []
      this.tableData = []
      listSongDetail(this.songListId).then(res => {
        for (let item of res.data) {
          this.getSong(item.songId)
        }
      })
    },
    // 添加歌曲前的准备，获取到歌曲id
    getSongId () {
      let that = this
      let songName = that.registerForm.songName
      songOfSongName(songName).then(res => {
        this.addSong(res.data.id)
      })
    },
    // 添加歌曲
    addSong (songId) {
      let that = this
      let params = {
        songId: songId,
        songListId: (Number)(this.songListId)
      }
      setListSong(params).then(res => {
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
      })
      this.$refs.registerForm.resetFields()
      that.centerDialogVisible = false
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.setContextData('currentPage', this.currentPage)
    },
    // 删除歌曲
    handleDelete (id) {
      delListSong(id)
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
