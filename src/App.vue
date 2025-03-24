<script setup>
import {onBeforeMount, onMounted, ref} from "vue";

import UploadFile from "@/components/UploadFile.vue";
import {auth, download, local, uploading} from "@/assets/js/file.js";
import {userStore} from "@/assets/js/store.js";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useRoute } from 'vue-router';
import Header from "@/components/side/header.vue";
import router from "./router";
const route = router.currentRoute
const user = userStore()
const handleClose = (done) => {
  done()
}
const uploadfile = ref(null)

const isActive = ref(false)

onBeforeMount(async () => {
  let token =  localStorage.getItem("token")
  console.log(router.meta)
  if (token !== null ) {
    try{
      const res =await axios.post(local + "api/v1/user/loadtoken", {
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
        }else{
          localStorage.removeItem("token")
          user.$reset()
          Router.push("/login")
        }
      }else{
        if (res.status === 401){
          localStorage.removeItem("token")
          user.$reset()
          Router.push("/login")
        }else{
          
        }
      }
    }catch( error){
      // localStorage.removeItem("token")
      // user.$reset()
      Router.push("/login")
    }
  }

})
</script>

<template>
<div id="content" style="display: flex;flex-direction: column;">


  <el-header style="margin: 0 0;z-index: 101" class="navbar nav-shadow" >
    <Header></Header>
  </el-header>
  <div class="container fill-height" style="width: 100%;transition: all 0.3s ease;min-height:calc(100vh - 10.5em) ">

    <router-view v-slot="{ Component, route, Path }" :key="$route.fullPath">
      <keep-alive v-if="route.meta.keepAlive">
        <component :is="Component" v-if="!route.meta.requireAuth || user.logined" />
      </keep-alive>
      <component v-else :is="Component" />

    </router-view>

  </div>
  <footer class="footer" style="background-color: rgba( 33,35,42,0.5)">
    <div class="content has-text-centered">
      <span>
         <a  style="color:#368CCB;"  href="https://github.com/ManInM00N/NicoFile">Nico File v0.1.1</a> 由 <a style="color:#368CCB;" href="https://github.com/ManInM00N">ManInM00N</a> 构建
      </span>
      <br/>
      <span >
        Copyright © 2024 by ManInM00N , All rights reserved.
      </span>
    </div>
  </footer>
</div>
</template>

<style lang="less" scoped>
@import "assets/css/container.less";
@import "assets/css/color.less";
.red-dot {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 10px;
  display: inline-block;
}

nav {
  margin-bottom: 16px;
}
.footer {
  padding: 1.5rem 1.5rem 2rem;
  margin-top: .5rem;
}

.fill-height {
  min-height: max(100%,100vh);
}

#content:before{
  background-size: cover;
  background: url("@/assets/bg.jpg") no-repeat center;
  z-index: -2;
  opacity: 1;
  transition: opacity .5s ease;
  content: '';
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
