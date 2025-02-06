<script setup>

import {
  ArrowUpBold,
  Delete, Download,
} from '@element-plus/icons-vue'
import {download, deletefile, local,  useable, calc, uploading, fmtDownloadTimes} from "@/assets/js/file.js";
import {ElMessageBox} from "element-plus";
import {onMounted, ref} from "vue";
import axios from "axios";
import {userStore} from "@/assets/js/store.js";
import Router from "@/router/index.js";
import RecommendArtcle from "@/components/side/recommendArtcle.vue";
const user = userStore()
const FindList = ref([])
let auth666 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIsImV4cCI6MTczODczODM1NSwiaWF0IjoxNzM4MTM0NzU1fQ.Xpv0ZN1vgZVI9HWX1OgNcL3jWp4NgmMsgfFr2xIe_xA"
const auth = ref('')
async function GetFileList() {

  const res = await axios.post(local + "api/v1/file/list", {
    page:1,
  },{
    headers: {
      "Authorization": localStorage.getItem("token"),
    },
  })
  FindList.value = res.data.list
}
onMounted(async () => {
  auth.value = user.getUserToken
  GetFileList()
})
</script>

<template>
  <div class="container " style="display: flex;width: 100%;" >
    <el-backtop :right="50" :bottom="50" style="color:#000000;">
      <el-icon><ArrowUpBold /></el-icon>
    </el-backtop>
    <div class="normal-container"   >
      <div v-if="FindList.length ===0" >
        <article>
          <h1>文件列表</h1>
        </article>
        <span>暂无文件</span>
      </div>
      <div v-else style="width: auto" >
        <div v-for="(item,index) in FindList" :key="item.id" class="file" >
          <div slot="header"  style="margin-bottom: 8px">
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
            <div>
              <span>{{fmtDownloadTimes(item.downloadcounts)}}</span>
            </div>
          </div>

          <div style="margin-bottom: 8px;margin-top: 16px">
            <span>{{item.desc===''?'无描述':item.desc}}</span>
          </div>

          <div style="display: flex;justify-content: flex-end">
            <el-button class="single-button"  size="default"   @click="()=>{download(local,user.getUserToken,item.path,item.name)}" style="padding-left: 2px;padding-right: 2px">
              <el-icon size=28 color="#40E0D0"><Download /></el-icon>
            </el-button>
            <el-button  class="single-button"  size="default"  @click="()=>{deletefile(local,item.id,auth);GetFileList()}" style="padding-left: 2px;padding-right: 2px" >
              <el-icon size=28 color="#FF0000"><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-left:50px;">
      <div >
        <RecommendArtcle>

        </RecommendArtcle>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../assets/css/container.less";
@import "../assets/css/color.less";
#tags span {
  background: @theme-second-color-light;
  border-radius:5px;
  font-size: .85em;
  padding: 2px 6px    2px   6px;
  margin: 3px 3px;
  display: inline-flex;
  line-height: 1.5em;
}
.file {
  box-shadow: 0 8px 16px -4px #00000050;
  background-color: @theme-background-color-light;
  //border-color: @border-color;
  border-radius: 6px;
  padding:18px 24px;
  width: auto;
  color: #4a4a4a;
  margin-bottom: 1.5rem;
}
.normal-container{
  min-width:min(100%, 900px);
  margin: auto;
  padding: 0;
}
.single-button{
    background-color: @theme-second-color;
    border: @border-color;
}
.fill-height{
  flex:1;
}
</style>