<template>
  <div class="comment-form">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="author">
        <el-input v-model="form.author" placeholder="您的姓名" />
      </el-form-item>

      <el-form-item prop="content">
        <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="写下您的评论..."
        />
      </el-form-item>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button v-if="parentId" @click="$emit('cancel')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  parentId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  author: '',
  content: ''
})

const rules = ref({
  author: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' }
  ]
})

const formRef = ref(null)

const submitForm = async () => {
  try {
    await formRef.value.validate()

    const commentData = {
      author: form.value.author,
      content: form.value.content
    }

    if (props.parentId) {
      commentData.parentId = props.parentId
    }

    emit('submit', commentData)
    form.value.content = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped lang="less">

@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
@import "@/assets/css/article.less";

.comment-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: @theme-second-color;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}
</style>