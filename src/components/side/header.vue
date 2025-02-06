<script setup>

import {uploading} from "@/assets/js/file.js";
import Router from "@/router/index.js";
import {ref} from "vue";
import {userStore} from "@/assets/js/store.js";
import UploadFile from "@/components/UploadFile.vue";
import {ArrowDown} from "@element-plus/icons-vue";
const dialogVisible = ref(false)

const user = userStore()

const handleClose = (done  ) => {
  done()
}

const cutName = (value) =>{
  if (!value) return "";
  if (value.length > 15) {
    return value.slice(0, 12) + "...";
  }
  return value;
}
const clear=()=>{
  localStorage.removeItem("token")
  user.$reset();
  Router.push('/login')
}

const drawer = ref(false)
</script>

<template>
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
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item is-size-5" href="/" style="font-weight: bold">
        <span style="color:#f7797d">N</span>
        <span >ico</span>
        <span style="color:#f7797d">F</span>
        <span >ile</span>
        <span>文件托管</span>

      </a>
      <a role="button" class="navbar-burger burger"  aria-label="menu" aria-expanded="false" data-target="mainNavbar" @click="()=>{drawer=!drawer}">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <el-drawer
        v-model="drawer"
        direction="rtl"
        :with-header="false"
        :before-close="handleClose"
        class="drawer"
        style="padding:8px 8px;--el-drawer-padding-primary: 0"
    >
      <div id="mainNavbar" class="navbar-menu is-active" >
        <div class="navbar-start">
          <router-link to="/" class="navbar-item is-size-6">首页</router-link>
          <el-divider style="margin:auto"></el-divider>
          <router-link to="/" class="navbar-item is-size-6">文件</router-link>
          <a v-if="user.logined && user.userToken!==''"  @click="dialogVisible = true" style="cursor: pointer"  class="navbar-item">
            <el-badge :value="uploading"
                      :show-zero="false"  >
            <span style="display: block" class="is-size-6" >
              上传
            </span>
            </el-badge>
          </a>

          <div class="navbar-item has-dropdown is-hoverable" v-if="user.logined && user.userToken!==''">
            <a style="" class="is-size-6 navbar-item">
              {{ cutName(user.username)}}
            </a>
            <router-link to='/user' class="navbar-item is-size-6">
              系统管理
            </router-link>
            <a href="https://github.com/ManInM00N/NicoFile" class="navbar-item is-size-6"  >
              项目地址

            </a>
            <router-link to="/login" @click="clear()" class="navbar-item">
                    <span style="display: block" class="is-size-6">
                      退出
                    </span>
            </router-link>
          </div>
          <div v-else>
            <router-link to="/login" class="navbar-item">
                <span style="display: block" class="is-size-6">
                  登录
                </span>
            </router-link>
          </div>
        </div>

      </div>
    </el-drawer>
    <div id="mainNavbar" class="navbar-menu" >
      <div class="navbar-start">
        <router-link to="/" class="navbar-item is-size-6">首页</router-link>
      </div>
      <div class="navbar-end" style="background-color: transparent">
        <div class="navbar-item" style="background-color: transparent">
          <el-badge :value="uploading"
                    :show-zero="false">
            <a  class="navbar-link"  @click="dialogVisible = true" style="cursor: pointer;" >
                <span style="padding: 7px 8px;display: block" class="is-size-6" >
                  上传
                </span>
            </a>
          </el-badge>
        </div>


        <div class="navbar-item has-dropdown is-hoverable" v-if="user.logined && user.userToken!==''">

          <el-dropdown :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, 0] } }] }">
            <a style="padding: 3px 6px;display: block;outline: none !important;display: flex;align-items: center;" class="is-size-6 navbar-link">
              {{ cutName(user.username)}}

              <el-icon color="#ffffff">
                <ArrowDown color="#ffffff"   />
              </el-icon>
            </a>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item  class="is-size-6">
                  <router-link to="/user">
                    个人中心
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item @click="()=>{Router.push('/user')}" class="is-size-6">
                  <router-link to="/user">
                    系统管理
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item  class="is-size-6">
                  <a href="https://github.com/ManInM00N/NicoFile" >
                    项目地址
                  </a>
                </el-dropdown-item>
                <el-divider style="margin:auto"></el-divider>
                <el-dropdown-item @click="clear()" class="is-size-6">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>

            </template>
          </el-dropdown>
        </div>
        <div v-else>
          <div class="navbar-item">
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

</template>

<style scoped lang="less">
@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
</style>