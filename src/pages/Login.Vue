<template>
  <div class="login-wrap">
    <div class="ms-title">music 后台管理登陆</div>
    <div class="ms-login">
      <Form ref="ruleForm" :model="ruleForm" :rules="ruleInline" @keydown.native.enter.prevent="submitForm">
        <Form-item prop="username">
          <Input type="text" v-model="ruleForm.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input
            type="password"
            v-model="ruleForm.password"
            placeholder="Password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item class="login-btn">
          <Button class="button" type="primary" @click="submitForm"
            >登录</Button
          >
        </Form-item>
      </Form>
    </div>
  </div>
</template>
<script>
import { getLoginStatus } from '../api/index.js'
import { mixin } from '../mixins/index.js'
export default {
  name: 'Login',
  mixins: [mixin],
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      let params = {
        username: this.ruleForm.username,
        password: this.ruleForm.password
      }
      getLoginStatus(params).then(res => {
        if (res.code === 1) {
          // 使用h5缓存存放登陆用户名
          localStorage.setItem('userName', this.ruleForm.username)
          this.$router.push('/home')
          this.$Notice.success({
            title: '登陆成功'
          })
        } else {
          this.$Notice.error({
            title: '用户名或密码错误'
          })
        }
      })
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {}
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.login-wrap {
  position: relative;
  background: url('../assets/img/background.jpg');
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
}

.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: #fff;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 220px;
  margin: -150px 0 0 -150px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-top: 2px;
}
</style>
