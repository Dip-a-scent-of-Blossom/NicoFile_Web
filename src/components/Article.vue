<script setup>
import Vditor from 'vditor'
import {onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue";
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
import {userStore} from "@/assets/js/store.js";
const route = router
const user =  userStore()
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
const isEditing = ref(false)
const editable = ref(false)
const editor = ref()
const newTitle = ref('')
const comments = ref([])
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
        cover:res.data.cover,
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
      await Vditor.preview( document.getElementById('article'), article.value.content, {
        speech: {
          enable: false,
        },
        anchor: 1,
        after() {
        },

      })
      newTitle.value = article.value.title
      editor.value = new Vditor("article-editor", {
        toolbarConfig: {
          pin: true,
        },
        value:article.value.content,
        height: '80vh',
        mode: 'ir',
        placeholder: '开始写作吧',
        after() {
          console.log("editor ready")
        },
      })
      editor.value.setValue(article.value.content)
    }else{

    }
  }catch(error){

  }

  // console.log(user.id.toString(),article.value.authorId,editable.value,article.value.cover)
})
onBeforeUnmount(() => {
  editor.value.destroy()
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
const switchHandler = ()=>{
  console.log(isEditing.value)
  isEditing.value = !isEditing.value;
}
const submitArticle = async ()=>{
  let res = null
  try {
    res = await axios.put(local + "/api/v1/article/"+id.value, {
      content: editor.value.getValue(),
      title: newTitle.value,
    }, {
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
    if (res.status === 200) {
      article.value.content = editor.value.getValue()
      article.value.title = newTitle.value
      isEditing.value = false
      await Vditor.preview( document.getElementById('article'), article.value.content, {
        speech: {
          enable: false,
        },
        anchor: 1,
        after() {
        },
      })
      // router.push("/article/" + id.value)
    } else {
      ElNotification({
        title: '上传失败',
        message: '服务器错误',
        type: 'error',
        position: 'bottom-right'
      })
    }
  } catch (error) {
    console.log(error)
  }
  // console.log(res)

}
const visable = ref(false)
const deleteArticle= async ()=>{
  visable.value = false
  let res = null
  try {
    res = await axios.delete(local + "/api/v1/article/"+id.value, {
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
    if (res.status ===200){
      ElNotification({
        title: '',
        message: res.data.message,
        type: 'info',
        position: 'bottom-right'
      })
      router.push("/")
    }else{

    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <el-dialog
      v-if="article.authorId === user.id.toString()"
      title="警告"
      v-model="visable"
  >
    <span>文章删除无法恢复，是否删除？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visable = false" type="primary">取消</el-button>
        <el-button type="danger" @click="deleteArticle">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
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
              <div style="display: block">
                <el-button v-if="article.authorId === user.id.toString() || user.id ===1" :disabled="editable" @click="switchHandler" type="primary" style="width: 60px" >修改</el-button>
                <el-button v-if="article.authorId === user.id.toString() || user.id ===1" :disabled="editable" @click="visable=true" type="danger" style="width: 60px" >删除</el-button>
              </div>
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
          <div v-show="!isEditing" >
            <div>
              <el-image :src="local + '/api/v1/img/download/'+article.cover" style="width: 100%">
              </el-image>
            </div>
            <br>
            <div id="article" >

            </div>
          </div>
          <div v-show="isEditing">
            <div class="vditor-reset" style="padding-bottom: 10px">
              文章标题: <el-input type="text" v-model="newTitle" style="width: 80%;height: 40px"/>
            </div>
            <div id="article-editor"  >

            </div>
            <div  style="padding:15px 15px 0px 15px;margin-left: auto">
              <el-button style="top:70%;position: relative" type="primary" @click="submitArticle" >保存</el-button>
            </div>
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