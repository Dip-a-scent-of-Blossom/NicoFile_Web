<template>
  <div class="comment">
    <!-- 当前评论内容 -->
    <div class="comment-content">
      <div style="display:flex">
        <el-avatar :size="50" :src="local+'/api/v1/img/cover/'+comment.authorid+'?_='+new Date().getTime()" />
        <div style="display:block;padding-left:8px;">
            <span>
            {{comment.author}}
            </span>
            <div class="comment-text">
                <span>
                {{ comment.content }}

                </span>
            </div>
            <span>
                
                {{comment.createdat}}
                <button class="reply-btn" @click="toggleReply">回复</button>
                <button class="reply-btn" style="" @click="toggleDelete">删除</button>
            </span>

        </div>
      </div>
      
    </div>

    <!-- 回复表单 (条件渲染) -->
    <CommentForm
        v-if="showReplyForm"
        @submit="handleReplySubmit"
        @cancel="toggleReply"
    />

    <!-- 嵌套的子评论 -->
    <div class="comment-replies" v-if="comment.comments && comment.comments.length">
      <Comment
          v-for="reply in comment.comments"
          :key="reply.id"
          :comment="reply"
      />
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import CommentForm from './commentForm.vue'
import {local} from "@/assets/js/file.js";
import axios from "axios";
import {ElNotification} from "element-plus";

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const showReplyForm = ref(false)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
const toggleDelete =async ()=>{
  let res = await axios.delete(local+"/api/v1/comment/"+props.comment.id, {
    headers: {
      "Authorization": localStorage.getItem("token"),
    }
  })
  console.log(res)
  if (res.status === 200) {
    props.comment.content = "该评论已被删除"
  }else{
    ElNotification({
      title: '删除失败',
      message: '服务器错误',
      type: 'error',
      position: 'bottom-right'
    })
  }
}
const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value
}

const handleReplySubmit = (replyData) => {
  let v = props.comment.id
  if (props.comment.parentid === 0){
    v = props.comment.id
  }else{
    v = props.comment.parentid
  }

  let res = axios.post(local+"/api/v1/comment",{
    articleid:props.comment.articleid,
    content:replyData.content,
    parentid: v
  }, {
    headers: {
      "Authorization": localStorage.getItem("token"),
    }
  })
  toggleReply()
}
onMounted(()=>{
})
</script>

<style scoped lang="less">

@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
@import "@/assets/css/article.less";
.comment {
  margin-bottom: 8px;
  padding: 8px;
}

.comment-content {
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
  margin: 0.3rem 0;
}

.comment-replies {
  margin-left: 2rem;
  margin-top: 1rem;
  border-left: 1px dashed #ddd;
  padding-left: 1rem;
}

.reply-btn {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  &:hover {
    text-decoration: underline;
  }
}

.delete-btn {
  background: none;
  border: none;
  color: orangered;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  &:hover {
    text-decoration: underline;
  }
}
</style>
