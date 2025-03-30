<template>
  <div class="comment">
    <!-- 当前评论内容 -->
    <div class="comment-content">
      <div style="display:flex">
        <el-avatar :size="50" :src="local+'/api/v1/img/download/'+comment.cover" />
        <div style="display:block;padding-left:8px;">
            <span>
            {{comment.authorname}}
            </span>
            <div class="comment-text">
                <span>
                {{ comment.content }}

                </span>
            </div>
            <span>
                
                {{comment.createdat}}
                <button class="reply-btn" @click="toggleReply">回复</button>
            </span>

        </div>
        
       
      </div>
      
    </div>

    <!-- 回复表单 (条件渲染) -->
    <CommentForm
        v-if="showReplyForm"
        :parent-id="comment.id"
        @submit="handleReplySubmit"
        @cancel="toggleReply"
    />

    <!-- 嵌套的子评论 -->
    <div class="comment-replies" v-if="comment.comment && comment.comment.length">
      <Comment
          v-for="reply in comment.comment"
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

const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value
}

const handleReplySubmit = (replyData) => {
  console.log('回复内容:', replyData)
  // 提交成功后可以刷新评论列表或直接添加到当前评论的子评论中
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
}

.reply-btn:hover {
  text-decoration: underline;
}
</style>
