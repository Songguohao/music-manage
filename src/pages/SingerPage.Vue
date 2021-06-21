<!--后台首页-->
<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <Button type="primary" @click="centerDialogVisible = true"
          >添加歌手</Button
        >
      </div>
    </div>
    <Modal v-model="centerDialogVisible" title="添加歌手" width="400px" center>
      <Form ref="registerForm" :model="registerForm" :rules="ruleValidate" :label-width="80">
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
                    <DatePicker type="date" placeholder="请选择出生日期" v-model="registerForm.birth"></DatePicker>
                </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="location" label="地区" size="mini">
          <Input v-model="registerForm.location" placeholder="地区"></Input>
        </FormItem>
        <FormItem prop="introduction" label="简介" size="mini">
          <Input v-model="registerForm.introduction" placeholder="简介" type="textarea"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="centerDialogVisible = false">取消</Button>
        <Button type="primary"  @click="addSinger">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { setSinger } from '../api/index.js'
export default {
  name: 'Singer',
  data () {
    return {
      centerDialogVisible: false,
      registerForm: {
        name: '',
        sex: '',
        birth: '',
        location: '',
        introduction: ''
      },
      ruleValidate: {
        name: [
          {required: true, message: '歌手姓名不能为空', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '性别不能为空', trigger: 'change'}
        ],
        date: [
          { required: true, type: 'date', message: '请选择出生日期', trigger: 'change' }
        ],
        location: [
          {required: true, message: '地区不能为空', trigger: 'blur'}
        ],
        introduction: [
          {required: false, trigger: 'blur'}
        ]
      }
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  methods: {
    addSinger () {
      let d = this.registerForm.birth
      let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      let params = {
        name: this.registerForm.name,
        sex: this.registerForm.sex,
        img: '/img/singerPic/Favorites.ico',
        birth: datetime,
        location: this.registerForm.location,
        introduction: this.registerForm.introduction
      }
      setSinger(params).then(res => {
        if (res.code === 1) {
          this.$Notice.success({
            title: '添加成功'
          })
        } else {
          this.$Notice.error({
            title: '添加失败'
          })
        }
      }).catch(err => {
        console.log(err)
      })
      this.centerDialogVisible = false
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.handle-box {
  margin-bottom: 20px;
}
</style>
