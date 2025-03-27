<script setup xmlns="http://www.w3.org/1999/html">
import {ref} from "vue";
import {getFileMd5, sleep} from "@/assets/js/encyrpt.js";
import {checkchunk, mergeFiles, uploadFileToServer,  local, useable,uploading} from "@/assets/js/file.js";
import {UploadFilled} from "@element-plus/icons-vue";
import {ElNotification} from "element-plus";

const progress = ref(0)
const progressNow = ref('')
const filename = ref('')
const hasupload = ref(0)
const chunktotals = ref(0)
const Ext = ref('')
const size = ref(0)
const fileMd5 = ref('')
const maxSize  = ref(5 * 1024 * 1024 * 1024) // 上传最大文件限制  最小单位是b
const chunkSize = 1024 * 1024 * 5 // 每块文件大小   100mb
const fileList = ref([])
const oncalcing = ref(false)
const desc = ref('')


async function RemoveFile(file, filelist) {
  console.log(file.name,file.status)
  fileList.value = filelist
  hasupload.value = 0
  size.value = 0
  progress.value = 0
  progressNow.value = ''
}
async function CalcFile(file, filelist) {
  fileList.value = filelist
  oncalcing.value = true
  console.log(file.status)
  if (file.status === 'removed'){
    hasupload.value = 0
    size.value = 0
    progress.value = 0
    progressNow.value = ''
    return
  }
  let fileName = file.name
  Ext.value = ''
  if (fileName.lastIndexOf('.') !== -1) {
    Ext.value = fileName.substring(fileName.lastIndexOf('.'))
    filename.value = fileName.substring(0, fileName.lastIndexOf('.'))
  }
  console.log(filename,Ext)
  size.value = file.size
  chunktotals.value = Math.ceil(size.value / chunkSize);
  hasupload.value = 0
  fileMd5.value = await getFileMd5(file.raw)
  useable.value = true
  console.log(fileMd5.value)
  oncalcing.value = false
}

const merge = async ()=>{
  const res = await mergeFiles(local,fileMd5.value,chunktotals.value, filename.value,Ext.value,size.value,desc.value)
  return res
}
const submit = async () => {
  useable.value = false
  progress.value = 0
  let uploadFile = fileList.value[0]
  if (chunktotals.value > 0) {
    let md5arr = []
    for (let chunkNumber = 0, start = 0; chunkNumber < chunktotals.value; chunkNumber++, start += chunkSize) {
      let end = Math.min(size.value, start + chunkSize);
      const file = uploadFile.raw.slice(start, end)
      const _md5  = await   getFileMd5(file)
      md5arr.push(_md5)
    }
    // 检查文件切片上传进度
    const resp = await checkchunk(local,chunktotals.value, filename.value,md5arr,fileMd5.value,Ext.value)
    if (resp ===null){
      ElNotification({
        title: '上传失败',
        message: '网络错误',
        type: 'error',
        position: 'bottom-right'
      })
      useable.value = true
      return
    }
    console.log("Total Chunks: ",chunktotals.value,resp)
    if (chunktotals.value === resp.accept && resp.message==="文件已存在"){
      progress.value = 100
      ElNotification({
        title: '上传成功',
        message: '文件已存在',
        type: 'info',
        position: 'bottom-right'
      })
      uploading.value --
      useable.value = true
      handleRemove(fileList[0])
      return
    }
    hasupload.value = resp.accept * chunkSize
    // 继续上传
    uploading.value ++
    for (let chunkNumber = resp.accept, start = resp.accept*chunkSize; chunkNumber < chunktotals.value && !useable.value; chunkNumber++, start += chunkSize) {
      let end = Math.min(size.value, start + chunkSize);
      const files = uploadFile.raw.slice(start, end)
      console.log(files,start,end)
      const result = await uploadFileToServer(local,files, chunkNumber , filename.value,md5arr[chunkNumber],Ext.value)
      if (result.status !== 200) {
        console.log(result.data,result)
        progress.value = 0
        progressNow.value = ''
        console.log("上传失败")
        return
      }else{
        const percent =  ((hasupload.value +files.size)  / 1024 / 1024).toFixed(2);
        const tot = (size.value/1024/1024).toFixed(2)
        progressNow.value = `${percent} MB/ ${tot} MB`
        progress.value = (hasupload.value +files.size) / size.value * 100
        hasupload.value += files.size
      }
      await sleep(500)
    }
    if (useable.value){
      uploading.value --
      return
    }
    console.log("分片上传完成")
    progress.value = 100
    progressNow.value = "上传完成"
    let res = await merge()
    if (res.data.error === true) {
      ElNotification({
        title: '上传失败',
        message: res.data.message,
        type: 'error',
        position: 'bottom-right'
      })
    }else{
      ElNotification({
        title: '上传成功',
        message: '文件上传成功',
        type: 'success',
        position: 'bottom-right',
      })
    }

  }
  handleRemove(fileList[0])
  uploading.value = 0
  useable.value = true
}
const handleRemove = (file)=> {
  fileList.value = []; // 更新文件列表
  if (fileList.length === 0) {
    useable.value = true; // 显示上传按钮
    uploading.value = 0
  }
}
defineExpose({
  submit,
})
</script>

<template>
  <el-upload
      ref = "upload"
      drag
      action="#"
      :auto-upload="false"
      :file-list="fileList"
      :limit="1"
      v-if="fileList.length === 0"
      :on-change="CalcFile"
      :on-remove="RemoveFile"
  >
    <template #trigger >
      <el-icon size="50" color="gray"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽文件到这里，或 <em>点击上传</em></div>
    </template>

  </el-upload>
  <div>
    <el-input
        v-model="desc"
        placeholder="文件描述"
    >

    </el-input>

  </div>
  <div v-if="oncalcing">
    <span>
      计算文件md5值......(文件越大用时越久，可能会出现卡顿)
    </span>
    <br/>
  </div>
  <br/>
  <div v-if="fileList.length > 0 && !oncalcing">
    <div :key="fileList[0].uid" class="file-item">
      <span>{{ fileList[0].name }}</span>
      <el-button type="text" @click="handleRemove(fileList[0])">移除</el-button>
    </div>
  </div>
  <br/>
  <div
      v-if="uploading"

  >

    <br/>
    <el-progress
        :text-inside="true"
        :percentage="progress"
        striped
        striped-flow
        :stroke-width="20"
        style="width:100%"
        drag
    >
      {{progressNow}}
    </el-progress>
  </div>
  <br/>
  <div class="dialog-footer" style="display: flex;text-align: right;align-items: center">
    <el-button type="primary"  @click="submit" :disabled="!useable || oncalcing">
      上传
    </el-button>
  </div>
</template>

<style lang="less" scoped>
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-top: 10px;
}
</style>