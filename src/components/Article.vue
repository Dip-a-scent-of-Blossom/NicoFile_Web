<script setup>
import Vditor from 'vditor'
import {onMounted} from "vue";
import "~vditor/src/assets/less/index"
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {jwtDecode} from "jwt-decode";
import Router from "@/router/index.js";
const route =
const vditor = new Vditor("show-editor", {height:100,toolbarConfig:pin})
onMounted(async ()=>{
  try{
    const res =await axios.post(local + "api/v1/article/"+route, {
    })
    console.log(token)
    let jwtDecodeVal = jwtDecode(token);
    if (res.status === 200) {
      if (res.data.error===false){
        user.setNew(token,res.data.username,'',jwtDecodeVal.id)
      }else{
        localStorage.removeItem("token")
        user.$reset()
        Router.push("/login")
      }
    }else{
      if (res.status === 401){
        localStorage.removeItem("token")
        user.$reset()
        Router.push("/login")
      }else{

      }
    }
  }catch( error){
    // localStorage.removeItem("token")
    // user.$reset()
    Router.push("/login")
  }
    await vditor.create()
    vditor.setValue('Hello, Vditor!') // set initial value
    vditor.off('ready', () => {
      console.log('Vditor is ready!')
    })
    vditor.on('change', (value) => {
      console.log('Vditor content change:', value)
    })

})
</script>

<template>
  <div class="container">
      <div class="normal-container">
        <div id="show-editor"></div>
      </div>
  </div>
</template>

<style scoped lang="less">

@import "../assets/css/container.less";
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";



</style>