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
      title="文件上传"
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
        style="--el-drawer-padding-primary: 0"
    >
      <div id="mainNavbar" class="navbar-menu is-active" style="background-color: transparent;height: 100%" >
        <div class="navbar-start">
          <router-link to="/" class="navbar-item is-size-6">首页</router-link>
          <el-divider style="margin:auto"></el-divider>
          <router-link to="/" class="navbar-item is-size-6">文件</router-link>
          <a v-if="user.logined && user.userToken!==''"  @click="dialogVisible = true" style="cursor: pointer"  class="navbar-item ">
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
        <div class="navbar-item" style="">
          <el-badge :value="uploading"
                    :show-zero="false">
            <a  class="navbar-link is-size-6"  @click="dialogVisible = true" style="cursor: pointer;display: block;padding:0 0 " >
<!--                <span style="" class=""  >-->
                  上传
<!--                </span>-->
            </a>
          </el-badge>
        </div>


        <div class="navbar-item has-dropdown is-hoverable" v-if="user.logined && user.userToken!==''">

          <el-dropdown class="" :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, 0] } }] }">
            <a style="padding: 3px 6px; outline: none !important;display: flex;align-items: center;" class="is-size-6 navbar-link">
              {{ cutName(user.username)}}
              <el-icon color="#ffffff">
                <ArrowDown color="#ffffff"   />
              </el-icon>
            </a>
            <template #dropdown>
              <el-dropdown-menu class="header-new-drop">
                <el-dropdown-item  class="is-size-6 " >
                  <router-link to="/user">
                    个人中心
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item @click="()=>{Router.push('/user')}" class="is-size-6">
                  <router-link  to="/user">
                    系统管理
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item  class="is-size-6 ">
                  <a href="https://github.com/ManInM00N/NicoFile" >
                    项目地址
                  </a>
                </el-dropdown-item>
                <el-divider style="margin:auto"></el-divider>
                <el-dropdown-item @click="clear()" class="is-size-6">
                  <span style="width: 100%">
                    退出
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>

            </template>
          </el-dropdown>
        </div>
        <div v-else class="navbar-item">
            <router-link to="/login" class="navbar-link" style="background-color: transparent">
                  登录
            </router-link>
        </div>
      </div>

    </div>


  </div>

</template>

<style scoped lang="less">
@import "@/assets/css/container.less";
@import "@/assets/css/color.less";

::v-deep .drawer{
  width: min(250px,80%) !important;
  --el-drawer-bg-color: @theme-background-color-light;
  padding: 0 0;
}

.header-new-drop {
  border: 0px solid #00487f !important;
  border-radius: 5px;
  padding: 0 0;
  background-color: @theme-second-color;
  :deep div {    // 注意：这里转深度书写样式修改它的 div 下方 after 样式
    &:after {
      border-bottom-color: rgba(0, 0, 0, 0.75)!important;
    }
  }
}


</style>

<style lang="less">
@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
@import "@/assets/css/elOverWrite.less";


.el-dropdown-menu {
  background-color: @theme-second-color-light ;
  border: 0px solid #00487f !important;
  border-radius: 5px;
  padding:0 0;
}
.el-dropdown-menu__item {

  color: #f0f000!important;
  line-height: 40px!important;
  padding: 0 26px!important;
  &:not(.is-disabled):focus,:not(.is-disabled):hover,:not(.is-disabled):focus,:not(.is-disabled):active {
    background-color: @theme-second-color-light !important;
    color: @focus-color;
      border:2px solid @theme-highlight-color solid!important;
  }
}
</style>