<script setup>
import Vditor from 'vditor'
import {onMounted} from "vue";
import 'vditor/dist/index.css';
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {jwtDecode} from "jwt-decode";
import Router from "@/router/index.js";
import router from '@/router/index.js';
const route = router
const wikiContent = '' // 这里就是要展示的文章，一般从后端接口获取
const editDocument = document.getElementById('article')

const vditor = new Vditor("article", {
    height:600,
    mode: 'sv',
    preview: {
        theme: {
        // 设置内容主题
        current: 'classic'
        },
        hljs: {
        // 设置代码块主题
        style: 'dracula'
        },
        actions: []
    },
    toolbarConfig: {
        pin: true
    },
            

})
onMounted(async ()=>{
  try{
    const res =await axios.post(local + "api/v1/article/"+route, {
    })
    if (res.status === 200) {
      
    }else{
      
    }
  }catch( error){

    // Router.push("/login")
  }
  vditor.setValue("1234")
    // await vditor.create()
    // vditor.setValue('Hello, Vditor!') // set initial value
    // vditor.off('ready', () => {
    //     console.log('Vditor is ready!')
    // })
    // vditor.on('change', (value) => {
    //     console.log('Vditor content change:', value)
    // })

})
</script>

<template>
  <div class="container">
      <div class="normal-container">
        <div id="article" ref="article">

        </div>
      </div>
  </div>
</template>

<style scoped lang="less">

@import "../assets/css/container.less";
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";



</style>