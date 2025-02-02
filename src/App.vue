<script setup>
import {onMounted, ref} from "vue";

import UploadFile from "@/components/UploadFile.vue";
import {auth, download, local, uploading} from "@/assets/js/file.js";
import item from "jsdom/lib/jsdom/living/helpers/validate-names.js";
import {userStore} from "@/assets/js/store.js";
import {jwtDecode} from "jwt-decode";

const dialogVisible = ref(false)
const user = userStore()
const handleClose = (done  ) => {
  done()
}
const uploadfile = ref(null)
onMounted(() => {
    let token =  localStorage.getItem("token")
    if (token === null){
        return
    }
    let jwtvalue = jwtDecode(token)
    user.setNew(localStorage.getItem("token"),"","",jwtvalue.id)
})

</script>

<template>
  <el-header style="margin: 0 0" class="navbar nav-shadow">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item is-size-5" href="/" style="font-weight: bold">
          文件托管
        </a>
      </div>
      <div id="mainNavbar" class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item is-size-6">首页</router-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <el-badge :value="uploading"
                      :show-zero="false">
              <a  @click="dialogVisible = true" style="cursor: pointer" >
                <span style="background-color: #eeeeee;padding: 3px 6px;display: block" class="is-size-6" >
                  上传
                </span>
              </a>
            </el-badge>

            <el-dialog
                v-model="dialogVisible"
                title="Tips"
                width="600"
                :before-close="handleClose"
            >
              <UploadFile ref="uploadfile" ></UploadFile>
              <template #footer>
              </template>
            </el-dialog>
            <div v-if="user.logined && user.userToken!==''">
              <router-link :to="'/user/:'+user.id" class="navbar-item">
                <span style="padding: 3px 6px;display: block" class="is-size-6">
                  {{user.username}}
                </span>
              </router-link>
            </div>
            <div v-else>
              <router-link to="/login" class="navbar-item">
                <span style="background-color: #eeeeee;padding: 3px 6px;display: block" class="is-size-6">
                  登录
                </span>
              </router-link>
            </div>
          </div>
        </div>

      </div>


    </div>

  </el-header>
  <div>

    <router-view v-slot="{ Component, route, Path }">
      <keep-alive v-if="route.meta.keepAlive">
        <component :is="Component"  />
      </keep-alive>
      <component v-else :is="Component" />

    </router-view>

  </div>
  <footer class="footer" style="background-color: white">
    <div class="content has-text-centered">
      <span>
         <a style="color:#368CCB;" href="https://github.com/ManInM00N/NicoFile">Nico File v0.0.0</a> 由 <a style="color:#368CCB;" href="https://github.com/ManInM00N">ManInM00N</a> 构建
      </span>
      <br/>
      <span>
        Copyright © 2024 by ※ ManInM00N ※ , All rights reserved.
      </span>

    </div>
  </footer>
</template>

<style lang="less" scoped>
@import "assets/css/container.less";
.red-dot {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 10px;
  display: inline-block;
}


.footer {
  padding: 1.5rem 1.5rem 2rem;
}
</style>
