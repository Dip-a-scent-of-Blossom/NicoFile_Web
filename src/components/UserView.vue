<script setup>
import {onMounted, reactive, ref} from "vue";
import {userStore} from "@/assets/js/store.js";
import {ElNotification} from "element-plus";
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {ChangeUserName, ChangeUserPassword, DeleteUser} from "@/assets/js/user.js";
import Router from "@/router/index.js";
import {Plus} from "@element-plus/icons-vue";
import {jwtDecode} from "jwt-decode";
const user = userStore()
const activeName = ref('first')

const display = ref(true)
const fileList = ref([])
function DisplayFile(file, filelist) {
  fileList.value = filelist
  display.value = fileList.value.length <= 0;
}

const tabswitch = (tab, event) => {
}
const form = reactive({
  newUsername:user.getUserName,
  newPassword:'',
})
const updateCover = async ()=>{
  let res = null
  let form = new FormData();
  if (fileList.value.length <= 0) {
    return
  }
  form.append("pic", fileList.value[0].raw);
  try {
    res = await axios.post(local+"/api/v1/user/upload",form, {
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
  } catch (error) {
    console.log(error)
  }
  if (res.status === 200) {
    ElNotification({
      title: '头像更新成功',
      message: '头像更新成功',
      type: 'success',
      position: 'bottom-right',
    });
  } else {
    ElNotification({
      title: '头像更新失败',
      message: '头像更新失败',
      type: 'error',
      position: 'bottom-right',
    });
  }
}
const updateUsername =async () => {
  let res = await ChangeUserName(form.newUsername)
  if (res.success) {
    ElNotification({
      title: '用户名更新成功',
      message: res.message,
      type: 'success',
      position: 'bottom-right',
    });
    user.username = res.resultname;
  }else{
    ElNotification({
      title: '用户名更新失败',
      message: res.message,
      type: 'error',
      position: 'bottom-right',
    });
  }
}
const updatePassword = async () => {
  let res =await ChangeUserPassword(form.newPassword)
  if (res.success) {
    ElNotification({
      title: '密码更新成功',
      message: res.message,
      type: 'success',
      position: 'bottom-right',
    });
  }else {
    ElNotification({
      title: '密码更新失败',
      message: res.message,
      type: 'error',
      position: 'bottom-right',
    });
  }
}
const DeleteUserHandle =async () => {
  let res = await DeleteUser()
  if (res.success){

    ElNotification({
      title: '注销成功',
      message: '您已经成功注销',
      type: 'success',
      position: 'bottom-right',
    });
    localStorage.removeItem("token")
    user.$reset()
    Router.push("/login")
  }else{
    ElNotification({
      title: '注销失败',
      message: res.message,
      type: 'error',
      position: 'bottom-right',
    });
  }
}

onMounted(()=>{
  let token = localStorage.getItem("token")
  let jwtDecodeVal = jwtDecode(token);
  user.id = jwtDecodeVal.UserId
})
</script>

<template>
  <div class="container">
    <div class="normal-container">
      <div class="box">
        <div class="table-container">
          <div class="">

            <el-tabs v-model="activeName" @tab-click="tabswitch">

              <el-tab-pane  name="first">
                <template #label>
                  <span class="is-size-6">账户管理</span>
                </template>
                <template #default>
                  <div style="display:block;">
                    <h2>
                      我的账户
                    </h2>
                    <el-form
                        label-position="top"
                        :model="form"
                        :inline="true"
                    >
                      <div class="columns" style="width: 100%" >
                        <div class="column">
                          <el-form-item>
                            <template #label>
                              <span class="is-size-6 " style="font-weight: 600;">更改账户名称</span>
                            </template>
                            <el-input v-model="form.newUsername" placeholder="请输入新的用户名" >
                              <template #append class="el-input-group__append" >
                                <el-button slot="append" color="#48a548" @click="updateUsername">
                                  提交
                                </el-button>
                              </template>
                            </el-input>
                          </el-form-item>
                        </div>
                        <div class="column">
                          <el-form-item >
                            <template #label>
                              <span class="is-size-6 " style="font-weight: 600;">更改密码</span>
                            </template>
                            <el-input v-model="form.newPassword" type="password" placeholder="请输入新的密码" >
                              <template #append>
                                <el-button slot="append" color="#373b44" @click="updatePassword">
                                  提交
                                </el-button>
                              </template>
                            </el-input>
                          </el-form-item>
                        </div>

                      </div>
                      <div class="columns">
                        <div class="column" style="padding-top: 0">
                          <el-image style="width: 148px;height: 148px;" :src="local+'/api/v1/img/cover/'+user.id+'?_='+new Date().getTime()">

                          </el-image>
                        </div>
                        <div class="column" style="display: flex;">
                          <span style="margin: auto 0;font-size: 24px;font-weight: 700;">=></span>
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
                    更换新头像
                  </span>
                              </div>
                            </template>
                          </el-upload>
                        </div>
                        <div class="column">

                          <el-button type="primary"  @click="updateCover">
                            提交新头像
                          </el-button>
                        </div>
                      </div>
                    </el-form>
                    <div class="" style="display: flex;flex-direction: column">

                      <label class="is-size-6 label" style="font-weight: 600;">
                        <span>
                          其他操作
                        </span>
                      </label>
                      <div class="buttons">
                        <el-button  color="#ee827c" @click="DeleteUserHandle">
                          注销
                        </el-button>
                      </div>
                    </div>
                  </div>
                </template>
              </el-tab-pane>

              <el-tab-pane  name="second">
                <template #label>
                  <span class="is-size-6">配置管理</span>
                </template>
                <template #default>
                  <div>
                    <span>
                      没有权限=.=
                    </span>
                  </div>
                </template>
              </el-tab-pane>

              <el-tab-pane label="文件管理" name="third">
                <template #label>
                  <span class="is-size-6">文件管理</span>
                </template>
                <template #default>
                  <div>
                    <span>
                      没有权限=.=
                    </span>
                  </div>
                </template>
              </el-tab-pane>

            </el-tabs>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
@import "@/assets/css/elOverWrite.less";


:deep .el-upload-dragger{
  height: 100%;
  width: 100%;
  padding: 60px 10px;
  background: transparent !important;
  border:   none !important;
}
/* 默认显示上传按钮 */
:deep(.el-upload--picture-card) {
  display: inline-flex;
}
.freePic ::v-deep .has-file .el-upload--picture-card {
  display: none;
}
</style>