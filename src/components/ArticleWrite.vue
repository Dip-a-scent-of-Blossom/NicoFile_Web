<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import Vditor from "vditor";
import axios from "axios";
import router from "@/router/index.js";
import {ElMessage, ElNotification} from "element-plus";
const editor = ref()
const title = ref('')
onMounted(async () => {
  const articleContainer = document.getElementById('article-container')
  editor.value = new Vditor("article", {
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
  try {
    res =await  axios.post('http://127.0.0.1:8888/api/v1/article', {
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
        <div class="vditor-reset" style="padding:15px 15px 0px 15px">
          <el-button style="float:right" type="primary" @click="submitArticle" >提交</el-button>
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



</style>