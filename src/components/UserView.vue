<script setup>
import {reactive, ref} from "vue";
import {userStore} from "@/assets/js/store.js";
import {ElNotification} from "element-plus";
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {ChangeUserName, ChangeUserPassword} from "@/assets/js/user.js";
const user = userStore()
const activeName = ref('first')

const tabswitch = (tab, event) => {
}
const form = reactive({
  newUsername:user.getUserName,
  newPassword:'',
})
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
                    </el-form>
                    <div class="" style="display: flex;flex-direction: column">

                      <label class="is-size-6 label" style="font-weight: 600;">
                        <span>
                          其他操作
                        </span>
                      </label>
                      <div class="buttons">
                        <el-button  color="#ee827c">
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
                    配置管理
                  </div>
                </template>
              </el-tab-pane>

              <el-tab-pane label="文件管理" name="third">
                <template #label>
                  <span class="is-size-6">文件管理</span>
                </template>
                <template #default>
                  <div>
                    <div class="box">

                    </div>
                    文件管理
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

:deep .el-tabs__item.is-active, .el-tabs__item:hover {
  color: @theme-highlight-color;
}

:deep .el-input-group__append{
  background-color: #48a548;
  color:#000000;
}
:deep .el-tabs__active-bar {
  background-color: @theme-highlight-color;
}

.table-container {
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  overflow-y: hidden;
  max-width: 100%;
}
.el-input{
  --el-input-bg-color: @theme-background-color-light;
  --el-input-text-color: @font-color;
  --el-input-border-color: @border-color  ;
  --el-input-focus-border-color: @theme-highlight-color;
}

</style>