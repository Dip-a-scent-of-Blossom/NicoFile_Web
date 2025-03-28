<script setup>
import Vditor from 'vditor'
import {onBeforeUnmount, onMounted, ref} from "vue";
import 'vditor/dist/index.css';
import '@/assets/css/article.less'
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {jwtDecode} from "jwt-decode";
import Router from "@/router/index.js";
import router from '@/router/index.js';
import {ElNotification} from "element-plus";
import {Star, View} from "@element-plus/icons-vue";
const route = router
const wikiContent = '' // 这里就是要展示的文章，一般从后端接口获取
const article  = ref({
  content:"",
  title:"",
  author:"",
  authorId : 1,
  created_at:"2024-07-29",
  view: 0,
  like:0,
})
const like  =ref(false)
const Like = async ()=>{
  if (like.value === true){
    return
  }
  like.value = true
  try{
    const res = await axios.post(local + "/api/v1/article/like", {
      id: Number(route.currentRoute.value.params.id),
    },{
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
    if (res.status === 200){
      article.value.like += 1
    }else{
      ElNotification({
        title: '点赞失败',
        message: '服务器错误',
        type: 'error',
        position: 'bottom-right'
      })
    }
  }catch(error){
    ElNotification({
      title: '点赞失败',
      message: '服务器错误',
      type: 'error',
      position: 'bottom-right'
    })
  }
}
onMounted(async ()=>{
  let id = route.currentRoute.value.params.id
  try{
    const res =await axios.get(local + "/api/v1/article/"+id, {
    })
    if (res.status === 200) {
      if (res.data.error === true){
        ElNotification({
          message: '文章不存在',
          type: 'error'
        })
        router.push("/")
        return
      }
      article.value = {
        content:res.data.content,
        title:res.data.title,
        author:res.data.authorname,
        authorId:res.data.authorid,
        created_at: res.data.createdat,
        view: Number(res.data.view),
        like: Number(res.data.like),
      }
    }else{
      
    }
  }catch(error){

  }

  await Vditor.preview( document.getElementById('article'), article.value.content, {
    speech: {
      enable: false,
    },
    anchor: 1,
    after() {
    },

  })

})

</script>

<template>

  <div class="container">
      <div class="normal-container" >
        <div class="container" id ="article-container" style="padding:16px 24px;border-radius: 10px">
          <div class="vditor-reset">
            <h1>
              {{article.title}}
            </h1>
          </div>
          <div class="vditor-reset" style="position: relative;padding:24px 12px;display: block">
            <div style="float:left;display: flex;flex-direction: column">
              <span style="font-weight: bold">作者</span>
              <span>{{article.author}}</span>
            </div>
            <div style="float:right;display: flex;flex-direction: column;padding-left: 16px">
              <span style="font-weight: bold;">发布时间</span>
              <span>{{article.created_at}}</span>
            </div>

            <div style="float:right;margin-top:24px;padding-left: 16px" >
              <el-icon ><View /></el-icon>
              <span>
                {{article.view}}
              </span>
            </div>
            <div style="float:right;margin-top:24px;">
              <el-icon :onclick="Like" :class="{'likeable':true,'likeColor':like}"><Star /></el-icon>
              <span>
                {{article.like}}
              </span>
            </div>
          </div>
          <div id="article"  >

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
.likeable{
  &:hover{
    cursor: pointer;
  }
}
.likeColor{
  color: @theme-highlight-color;
}
</style>