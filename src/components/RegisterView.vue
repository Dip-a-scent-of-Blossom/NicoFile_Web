<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import {local} from "@/assets/js/file.js";
import Router from "@/router/index.js";
import {jwtDecode} from "jwt-decode";
import {userStore} from "@/assets/js/store.js";
const username = ref('')
const email = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const user = userStore()
const handleRegister =async () => {
  try{
    const res = await axios.post(local + 'api/v1/user/register', {
      username: username.value,
      password: password.value,
    })
    if (res.status === 200) {
      alert('注册成功')
      var jwtDecodeVal = jwtDecode(res.data.token);
      localStorage.setItem("token",res.data.token);
      console.log(jwtDecodeVal)
      Router.push("/")
    } else {
      console.log(res)
      alert('注册失败')
    }
  }catch(error){
    console.log(error)
  }

}
onMounted(() => {
  if (user.logined) {
    Router.push("/")
  }
})
</script>
<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="form-header">
        <h2>创建账号</h2>
        <p>开启您的美好旅程</p>
      </div>
      <form @submit.prevent="handleRegister" class="floating-form">
        <div class="input-group">
          <input type="text" id="username" v-model="username" required maxlength="20" />
          <label for="username" style="background-color: transparent">用户名</label>
          <span class="highlight"></span>
        </div>
        <div class="input-group">
          <input type="password" id="password" v-model="password" required minlength="6" maxlength="20" />
          <label for="password" style="background-color: transparent">密码</label>
          <span class="highlight"></span>
        </div>
        <div class="input-group">
          <input type="password" id="confirmPassword" v-model="confirmPassword" required minlength="6" maxlength="20" />
          <label for="confirmPassword" style="background-color: transparent">确认密码</label>
          <span class="highlight"></span>
        </div>
        <button type="submit" class="submit-btn">
          <span>立即注册</span>
          <i class="arrow-icon"></i>
        </button>
        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>



<style scoped lang="less">
@import "../assets/css/login.less";
@import "../assets/css/color.less";

.send-code-btn {
  padding: 0 20px;
  background: #e8f5fe;
  color: #3498db;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-code-btn:hover {
  background: #d0e9fd;
}



</style>