<template>
  <div class="comment-list">
    <h3>评论 ({{ comments.length }})</h3>

    <!-- 主评论表单 -->
    <CommentForm @submit="handleNewComment" />

    <!-- 评论列表 -->
    <div v-if="comments.length > 0">
      <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
      />
    </div>

    <div v-else class="no-comments">
      暂无评论，快来发表第一条评论吧！
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Comment from './comment.vue'
import CommentForm from './commentForm.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

// 模拟数据 - 实际应从API获取
const comments = props.comment

const handleNewComment = (commentData) => {
  // 这里应该调用API提交新评论
  console.log('新评论:', commentData)
  // 提交成功后可以刷新评论列表或直接添加到comments数组
}
</script>

<style scoped lang="less">

@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
@import "@/assets/css/article.less";
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