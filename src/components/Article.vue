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
import Comment from "@/components/side/comment.vue";
import CommentForm from "@/components/side/commentForm.vue";
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
const comments = ref([

])
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
const id = ref('')
onMounted(async ()=>{
  console.log(route.currentRoute.value.params.id)
  id.value = route.currentRoute.value.params.id
  try{
    const res =await axios.get(local + "/api/v1/article/"+id.value, {
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
  try{
    const res =await axios.get(local + "/api/v1/comment/list?articleid="+id.value, {
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
      comments.value = res.data.list
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
const handleNewComment = (commentData) => {

  let res = axios.post(local+"/api/v1/comment",{
    articleid:Number(id.value),
    content:commentData.content,
    parentid:0
  }, {
    headers: {
      "Authorization": localStorage.getItem("token"),
    }
  })
  console.log('新评论:', commentData)
  // 提交成功后可以刷新评论列表或直接添加到comments数组
}
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
          <div class="comments" >
            <div class="comment-list">
              <h3>评论 ({{ comments.length }})</h3>

              <CommentForm @submit="handleNewComment" :parent-id="0" />

              <div v-if="comments.length > 0">
                <Comment
                    v-for="comment in comments"
                    :key="comment.id"
                    :comment="comment"
                    :authorId="article.authorId"
                />
              </div>

              <div v-else class="no-comments">
                暂无评论，快来发表第一条评论吧！
              </div>
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
.comments{
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
}
.likeable{
  &:hover{
    cursor: pointer;
  }
}
.likeColor{
  color: @theme-highlight-color;
}

.comment-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: @theme-second-color;
}

.no-comments {
  padding: 1rem;
  text-align: center;
  color: @font-color;
}
</style>