<script setup>
import {onMounted, reactive, ref} from "vue";
import {local} from "@/assets/js/file.js";
import axios from "axios";
import {userStore} from "@/assets/js/store.js";
import router from "@/router/index.js";
import Router from "@/router/index.js";
import {jwtDecode} from "jwt-decode";
const user = userStore()
const username = ref('')
const password = ref('')
// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

const errorMsg = ref('')
const isFormValid = ref(false)

// 输入验证
const validateInput = () => {
  // 基本验证
  if (loginForm.username && loginForm.password) {
    isFormValid.value = true
    errorMsg.value = ''
  } else {
    isFormValid.value = false
  }
}

const handleLogin = async () => {
  const xssPattern = /(~|\{|\}|"|'|<|>|\?)/g
  if (xssPattern.test(loginForm.username) || xssPattern.test(loginForm.password)) {
    errorMessage('警告:输入内容包含非法字符');
    return
  }
  try {
    const res  = await axios.post(local + '/api/v1/user/login',{
      username: loginForm.username,
      password: loginForm.password
    })
    if (res.status === 200) {
        var jwtDecodeVal = jwtDecode(res.data.token);
        console.log(jwtDecodeVal)
        user.setNew(res.data.token,res.data.username,'',jwtDecodeVal.UserId)
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("username",res.data.username);
        console.log("登录成功")
        Router.push("/")
    }
  } catch (error) {
    console.log(error)
    errorMessage('登录失败，请稍后重试');
  }
}

// 错误提示
const errorMessage = (text) => {
  errorMsg.value = text
  setTimeout(() => {
    errorMsg.value = ''
  }, 3000)
}

onMounted(async () => {
  let token =  localStorage.getItem("token")
  if (token !== null ) {
    try{
      const res =await axios.post(local + "/api/v1/user/loadtoken", {
      },{
        headers: {
          "Authorization": token,
        }
      })
      console.log(token)
      let jwtDecodeVal = jwtDecode(token);
      if (res.status === 200) {
        if (res.data.error===false){
          user.setNew(token,res.data.username,'',jwtDecodeVal.id)
          Router.push("/")
        }else{
          localStorage.removeItem("token")
          user.$reset()
        }
      }else{
        if (res.status === 401){
          localStorage.removeItem("token")
          user.$reset()
        }else{

        }
      }
    }catch( error){
      console.log(error)
    }
  }
  validateInput()
})
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="form-header">
        <h2>用户登录</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      <form @submit.prevent="handleLogin" class="floating-form">
        <div class="input-group">
          <input id="username" v-model.trim="loginForm.username" type="text" autocomplete="off" @input="validateInput" required />
          <label for="username" style="background-color: transparent">用户名</label>
          <span class="highlight"></span>
        </div>
        <div class="input-group">
          <input id="password" v-model.trim="loginForm.password" type="password" autocomplete="off" @input="validateInput" required />
          <label for="password" style="background-color: transparent">密码</label>
          <span class="highlight"></span>
        </div>
        <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>
        <button type="submit" class="submit-btn" :disabled="!isFormValid">
          <span>登录</span>
          <i class="arrow-icon"></i>
        </button>
        <div class="form-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </form>
    </div>
  </div>

</template>

<style scoped lang="less">
@import "../assets/css/login.less";
@import "../assets/css/color.less";





</style>