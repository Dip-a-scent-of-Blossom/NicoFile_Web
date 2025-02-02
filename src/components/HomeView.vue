<script setup>

import {
  ArrowUpBold,
  Delete, Download,
} from '@element-plus/icons-vue'
import {download, deletefile, local, auth, useable, calc,uploading} from "@/assets/js/file.js";
import {ElMessageBox} from "element-plus";
import {onMounted, ref} from "vue";
import axios from "axios";
import {userStore} from "@/assets/js/store.js";
import Router from "@/router/index.js";
const user = userStore()
const FindList = ref([])
let auth666 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIsImV4cCI6MTczODczODM1NSwiaWF0IjoxNzM4MTM0NzU1fQ.Xpv0ZN1vgZVI9HWX1OgNcL3jWp4NgmMsgfFr2xIe_xA"

async function GetFileList() {
  const res = await axios.post(local + "api/v1/file/list", {
    page:1,
  },{
    headers: {
      "Authorization": user.userToken,
    },
  })
  FindList.value = res.data.list
  console.log(FindList.value)
}
onMounted(async () => {
  if (user.logined && user.userToken !== '') {
    const res =await axios.post(local + "api/v1/user/loadtoken", {
      id : user.id,
    },{
      headers: {
        "Authorization": user.userToken,
      }
    })
    if (res.status === 200) {
      if (res.data.error===false){
        user.username = res.data.username
        GetFileList()
      }else{
        user.$reset()
        Router.push("/login")
      }
    }else{
      user.$reset()
      Router.push("/login")
    }
  }
})
</script>

<template>
  <div class="container" >
    <el-backtop :right="50" :bottom="50" style="color:#000000;">
      <el-icon><ArrowUpBold /></el-icon>
    </el-backtop>
    <div class="normal-container" >
      <div v-for="(item,index) in FindList" :key="item.id" class="file" >
        <div slot="header" class="clearfix" style="margin-bottom: 8px">
              <span @click="()=>{download(local,auth,item.path,item.name)}" font-bold="true" style="font-size: x-large;color:#368CCB;font-weight: 520;cursor: pointer;">
              {{item.name}}
              </span>
        </div>
        <div style="display: flex;flex-direction: row;margin-bottom: 8px" id="tags">
          <div>
              <span>
                {{item.posterName}}
              </span>
          </div>
          <div >
            <span >{{calc(item.size)}}</span>
          </div>
          <div>
            <span >{{item.ext}}</span>
          </div>
          <div>
            <span>{{item.createdAt}} </span>
          </div>
        </div>

        <div style="margin-bottom: 8px;margin-top: 16px">
          <span>{{item.desc===''?'无描述':item.desc}}</span>
        </div>

        <div style="display: flex;justify-content: flex-end">
          <!--            <span>下载次数:{{item.downloadTimes}}</span>-->
          <el-button color="#FFFFFF" size="small"   @click="()=>{download(local,auth,item.path,item.name)}" style="padding-left: 2px;padding-right: 2px">
            <el-icon size=24 color="#40E0D0"><Download /></el-icon>
          </el-button>
          <el-button  color="#FFFFFF" size="small"  @click="()=>{deletefile(local,item.id,auth);GetFileList()}" style="padding-left: 2px;padding-right: 2px" >
            <el-icon size=24 color="#FF0000"><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../assets/css/container.less";
#tags span {
  background:#f0f0f0;
  border-radius:5px;
  font-size: .85em;
  color: rgba(0,0,0,.7);
  padding: 2px 6px    2px   6px;
  margin: 3px 3px;
  display: inline-flex;
}
.file {
  box-shadow: 0 .5em 1em -.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
  background-color: #fff;
  border-radius: 6px;
  padding:18px 24px;
  max-width: 1100px;
  color: #4a4a4a;
  margin-bottom: 1.5rem;
}
.container {
  display: block;
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  width: auto;

  @media screen and (min-width: 1024px) {
    max-width: 960px;
  }

  @media screen and (max-width: 1215px) {
    &.is-widescreen:not(.is-max-desktop) {
      max-width: 1152px;
    }
  }

  @media screen and (max-width: 1407px) {
    &.is-fullhd:not(.is-max-desktop):not(.is-max-widescreen) {
      max-width: 1344px;
    }
  }

  @media screen and (min-width: 1216px) {
    &:not(.is-max-desktop) {
      max-width: 1152px;
    }
  }

  @media screen and (min-width: 1408px) {
    &:not(.is-max-desktop):not(.is-max-widescreen) {
      max-width: 1344px;
    }
  }
}
.normal-container{
  margin: auto;
  max-width: 1200px;
  padding: 16px 16px;
  overflow-wrap: break-word;
  word-break: break-word;
  display: block;
}
.nav-shadow {
  box-shadow: 0 2px 3px rgba(26, 26, 26, .1);
}

</style>