<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import Vditor from "vditor";
import axios from "axios";
import router from "@/router/index.js";
import {ElMessage, ElNotification} from "element-plus";
import {Plus, UploadFilled} from "@element-plus/icons-vue";
import {local} from "@/assets/js/file.js";
const editor = ref()
const title = ref('')
const display = ref(true)
const fileList = ref([])
function DisplayFile(file, filelist) {
  fileList.value = filelist
  display.value = fileList.value.length <= 0;
}
onMounted(async () => {
  const articleContainer = document.getElementById('article-container')
  editor.value = new Vditor("article", {
    cdn: '/vditor',
    toolbarConfig: {
      pin: true,
    },
    height: '80vh',
    mode: 'ir',
    placeholder: '开始写作吧',
    after() {
      console.log(111)
    },
  })
})
const submitArticle = async ()=> {
  console.log(editor.value.getValue())
  let res = null
  let form = new FormData();
  form.append("pic", fileList.value[0].raw);
  try {

    res = await axios.post(local+"api/v1/img/upload",form, {
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
    res =await  axios.post(local+'api/v1/article', {
      content: editor.value.getValue(),
      title: title.value,
    }, {
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
  } catch (error) {
    console.log(error)
  }
  console.log(res)
  if (res.status === 200) {
    router.push("/article/" + res.data.articleid)
  } else {
    ElNotification({
      title: '上传失败',
      message: '服务器错误',
      type: 'error',
      position: 'bottom-right'
    })
  }
}
onBeforeUnmount(()=>{
  editor.value.destroy()
})
</script>

<template>
  <div class="container">
    <div class="normal-container" >
      <div class="container" id ="article-container" style="padding:16px 24px;border-radius: 10px">
        <div class="vditor-reset" style="padding-bottom: 10px">
          文章标题: <el-input type="text" v-model="title" style="width: 80%;height: 40px"/>
        </div>
        <div id="article">


        </div>
        <div style="line-height: 61px;">
          <span style="padding-left: 12px;font-size: 20px;font-weight: 500;">发布设置</span>
        </div>
        <div style="display: flex;padding-bottom: 16px;min-width: 100%">
          <div>
            <span style="padding-left: 24px">
              封面设置
            </span>
          </div>
          <div style="padding-left: 16px"
               class="freePic"
          >
            <el-upload
                ref = "upload"
                drag
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :file-list="fileList"
                :limit="1"
                :on-change="DisplayFile"
                :class="{ 'has-file': !display }"
                :on-remove="DisplayFile"
            >
              <template #trigger >
                <div class="el-upload__text" style="color: black">
                  <el-icon color="#000"><Plus /></el-icon>
                  <span style="color:#000;">
                    添加文章封面
                  </span>
                </div>
              </template>
            </el-upload>
          </div>
          <div  style="padding:15px 15px 0px 15px;margin-left: auto">
            <el-button style="top:70%;position: relative" type="primary" @click="submitArticle" >提交</el-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="less">


@import "../assets/css/container.less";
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
@import "@/assets/css/article.less";
#article-container{
  background-color: @theme-second-color-light;
  border-radius: 10px;
}

:deep .el-upload-dragger{
  height: 100%;
  width: 100%;
  padding: 60px 10px;
  background: transparent !important;
  border:   none !important;
}
//:deep .el-upload--picture-card{
//  display: none !important;
//}
/* 默认显示上传按钮 */
:deep(.el-upload--picture-card) {
  display: inline-flex;
}
.freePic ::v-deep .has-file .el-upload--picture-card {
  display: none;
}
</style>