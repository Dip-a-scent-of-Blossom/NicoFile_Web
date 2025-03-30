<script setup>
import {onMounted, ref} from "vue";
import {userStore} from "@/assets/js/store.js";
import {FetchArticle} from "@/assets/js/article.js";
import axios from "axios";
import {local} from "@/assets/js/file.js";
const user = userStore()
const showpic = ref(false)
const article = ref([
  {
    title: '文章标题a',
    link: '/article/1',
  },
  {
    title: '文章标题b',
    link: '/article/2',
  },
])
const board = ref([
  {
    title: '项目后端地址 v0.1.4',
    link: 'https://github.com/ManInM00N/NicoFile',
  },
  {
    title: '项目前端地址 v0.1.2',
    link: 'https://github.com/Dip-a-scent-of-Blossom/NicoFile_Web'
  },
])
onMounted(async () => {
  let res = null
  try {
    res = await axios.get(local+"/api/v1/article/rank", {
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    })
    if (res.status === 200) {
      article.value = res.data.list
    }
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <div class="float-form">

  <div class="recommendBar">
    <div class="recommendArtcle">
      <div class="recommendArtcle-title">
        <h2 style="margin: 14px 0;padding-top: 14px">公告</h2>
      </div>
      <div v-for="(item, index) in board" :key="item.id" style="margin: 4px 0">
        <div>
          <router-link :to="'/article/'+item.id" class="recommendArtcle-item-title" >
            <span >{{item.title}}</span>
          </router-link>
        </div>
      </div>
      <div>
      <span>
        喜欢此项目请点个star
      </span>
      </div>
      <div>
        <span>
            Ciallo～(∠・ω< )⌒★
        </span>
      </div>
    </div>
  </div>
  <div class="recommendBar" style="padding-left: 0">
      <div style="padding-top: 8px;display: flex;align-items: center;flex-direction: column" >
        <el-avatar style="margin: auto;justify-items: center" :size="90" src="avatar.jpg" />
        <span class="is-size-5 bold">ManInM00N</span>
      </div>
      <div style="justify-content: space-around;display: flex;padding: 0 60px">
        <a href="https://space.bilibili.com/34196534">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#74C0FC" d="M488.6 104.1C505.3 122.2 513 143.8 511.9 169.8V372.2C511.5 398.6 502.7 420.3 485.4 437.3C468.2 454.3 446.3 463.2 419.9 464H92C65.6 463.2 43.8 454.2 26.7 436.8C9.7 419.4 .8 396.5 0 368.2V169.8C.8 143.8 9.7 122.2 26.7 104.1C43.8 87.8 65.6 78.8 92 78H121.4L96.1 52.2C90.3 46.5 87.4 39.2 87.4 30.4C87.4 21.6 90.3 14.3 96.1 8.6C101.8 2.9 109.1 0 117.9 0C126.7 0 134 2.9 139.8 8.6L213.1 78H301.1L375.6 8.6C381.7 2.9 389.2 0 398 0C406.8 0 414.1 2.9 419.9 8.6C425.6 14.3 428.5 21.6 428.5 30.4C428.5 39.2 425.6 46.5 419.9 52.2L394.6 78L423.9 78C450.3 78.8 471.9 87.8 488.6 104.1H488.6zM449.8 173.8C449.4 164.2 446.1 156.4 439.1 150.3C433.9 144.2 425.1 140.9 416.4 140.5H96.1C86.5 140.9 78.6 144.2 72.5 150.3C66.3 156.4 63.1 164.2 62.7 173.8V368.2C62.7 377.4 66 385.2 72.5 391.7C79 398.2 86.9 401.5 96.1 401.5H416.4C425.6 401.5 433.4 398.2 439.7 391.7C446 385.2 449.4 377.4 449.8 368.2L449.8 173.8zM185.5 216.5C191.8 222.8 195.2 230.6 195.6 239.7V273C195.2 282.2 191.9 289.9 185.8 296.2C179.6 302.5 171.8 305.7 162.2 305.7C152.6 305.7 144.7 302.5 138.6 296.2C132.5 289.9 129.2 282.2 128.8 273V239.7C129.2 230.6 132.6 222.8 138.9 216.5C145.2 210.2 152.1 206.9 162.2 206.5C171.4 206.9 179.2 210.2 185.5 216.5H185.5zM377 216.5C383.3 222.8 386.7 230.6 387.1 239.7V273C386.7 282.2 383.4 289.9 377.3 296.2C371.2 302.5 363.3 305.7 353.7 305.7C344.1 305.7 336.3 302.5 330.1 296.2C323.1 289.9 320.7 282.2 320.4 273V239.7C320.7 230.6 324.1 222.8 330.4 216.5C336.7 210.2 344.5 206.9 353.7 206.5C362.9 206.9 370.7 210.2 377 216.5H377z"/></svg>

        </a>
        <a href="https://github.com/ManInM00N">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#FFD43B" d="M448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM265.8 407.7c0-1.8 0-6 .1-11.6c.1-11.4 .1-28.8 .1-43.7c0-15.6-5.2-25.5-11.3-30.7c37-4.1 76-9.2 76-73.1c0-18.2-6.5-27.3-17.1-39c1.7-4.3 7.4-22-1.7-45c-13.9-4.3-45.7 17.9-45.7 17.9c-13.2-3.7-27.5-5.6-41.6-5.6s-28.4 1.9-41.6 5.6c0 0-31.8-22.2-45.7-17.9c-9.1 22.9-3.5 40.6-1.7 45c-10.6 11.7-15.6 20.8-15.6 39c0 63.6 37.3 69 74.3 73.1c-4.8 4.3-9.1 11.7-10.6 22.3c-9.5 4.3-33.8 11.7-48.3-13.9c-9.1-15.8-25.5-17.1-25.5-17.1c-16.2-.2-1.1 10.2-1.1 10.2c10.8 5 18.4 24.2 18.4 24.2c9.7 29.7 56.1 19.7 56.1 19.7c0 9 .1 21.7 .1 30.6c0 4.8 .1 8.6 .1 10c0 4.3-3 9.5-11.5 8C106 393.6 59.8 330.8 59.8 257.4c0-91.8 70.2-161.5 162-161.5s166.2 69.7 166.2 161.5c.1 73.4-44.7 136.3-110.7 158.3c-8.4 1.5-11.5-3.7-11.5-8zm-90.5-54.8c-.2-1.5 1.1-2.8 3-3.2c1.9-.2 3.7 .6 3.9 1.9c.3 1.3-1 2.6-3 3c-1.9 .4-3.7-.4-3.9-1.7zm-9.1 3.2c-2.2 .2-3.7-.9-3.7-2.4c0-1.3 1.5-2.4 3.5-2.4c1.9-.2 3.7 .9 3.7 2.4c0 1.3-1.5 2.4-3.5 2.4zm-14.3-2.2c-1.9-.4-3.2-1.9-2.8-3.2s2.4-1.9 4.1-1.5c2 .6 3.3 2.1 2.8 3.4c-.4 1.3-2.4 1.9-4.1 1.3zm-12.5-7.3c-1.5-1.3-1.9-3.2-.9-4.1c.9-1.1 2.8-.9 4.3 .6c1.3 1.3 1.8 3.3 .9 4.1c-.9 1.1-2.8 .9-4.3-.6zm-8.5-10c-1.1-1.5-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3c1.1 1.5 1.1 3.3 0 4.1c-.9 .6-2.6 0-3.7-1.5zm-6.3-8.8c-1.1-1.3-1.3-2.8-.4-3.5c.9-.9 2.4-.4 3.5 .6c1.1 1.3 1.3 2.8 .4 3.5c-.9 .9-2.4 .4-3.5-.6zm-6-6.4c-1.3-.6-1.9-1.7-1.5-2.6c.4-.6 1.5-.9 2.8-.4c1.3 .7 1.9 1.8 1.5 2.6c-.4 .9-1.7 1.1-2.8 .4z"/></svg>
        </a>
        <a href="https://qm.qq.com/q/E5lY4pHooo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffffff" d="M433.8 420.4c-11.5 1.4-44.9-52.7-44.9-52.7 0 31.3-16.1 72.2-51.1 101.8 16.8 5.2 54.8 19.2 45.8 34.4-7.3 12.3-125.5 7.9-159.6 4-34.1 3.8-152.3 8.3-159.6-4-9-15.3 28.9-29.2 45.8-34.4-34.9-29.5-51.1-70.4-51.1-101.8 0 0-33.3 54.1-44.9 52.7-5.4-.7-12.4-29.6 9.3-99.7 10.3-33 22-60.5 40.1-105.8C60.7 98.1 109 0 224 0c113.7 0 163.2 96.1 160.3 215 18.1 45.2 29.9 72.9 40.1 105.8 21.8 70.1 14.7 99.1 9.3 99.7z"/></svg>
        </a>
        <div style="position: relative;
  display: inline-block;">
          <svg xmlns="http://www.w3.org/2000/svg" style="width: 28px;height: 28px" viewBox="0 0 576 512"

               @mouseover="showpic = true"
               @mouseleave="showpic = false"
          ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#63E6BE" d="M385.2 167.6c6.4 0 12.6 .3 18.8 1.1C387.4 90.3 303.3 32 207.7 32 100.5 32 13 104.8 13 197.4c0 53.4 29.3 97.5 77.9 131.6l-19.3 58.6 68-34.1c24.4 4.8 43.8 9.7 68.2 9.7 6.2 0 12.1-.3 18.3-.8-4-12.9-6.2-26.6-6.2-40.8-.1-84.9 72.9-154 165.3-154zm-104.5-52.9c14.5 0 24.2 9.7 24.2 24.4 0 14.5-9.7 24.2-24.2 24.2-14.8 0-29.3-9.7-29.3-24.2 .1-14.7 14.6-24.4 29.3-24.4zm-136.4 48.6c-14.5 0-29.3-9.7-29.3-24.2 0-14.8 14.8-24.4 29.3-24.4 14.8 0 24.4 9.7 24.4 24.4 0 14.6-9.6 24.2-24.4 24.2zM563 319.4c0-77.9-77.9-141.3-165.4-141.3-92.7 0-165.4 63.4-165.4 141.3S305 460.7 397.6 460.7c19.3 0 38.9-5.1 58.6-9.9l53.4 29.3-14.8-48.6C534 402.1 563 363.2 563 319.4zm-219.1-24.5c-9.7 0-19.3-9.7-19.3-19.6 0-9.7 9.7-19.3 19.3-19.3 14.8 0 24.4 9.7 24.4 19.3 0 10-9.7 19.6-24.4 19.6zm107.1 0c-9.7 0-19.3-9.7-19.3-19.6 0-9.7 9.7-19.3 19.3-19.3 14.5 0 24.4 9.7 24.4 19.3 .1 10-9.9 19.6-24.4 19.6z"/></svg>

        </div>

      </div>
      <img
          v-show="showpic"
          src="/wechat.jpg"
          alt="悬浮图片"
          class="hover-image"
      >
  </div>
  <div>
    <div class="recommendBar">
      <div class="recommendArtcle">
        <div class="recommendArtcle-title">
          <h2 style="margin: 14px 0;padding-top: 14px">推荐文章</h2>
        </div>
        <div v-for="(item, index) in article" :key="item.id" >
          <div >
            <span style="margin-right: 10px;color:#f0f0f0 ">{{index+1}}</span>
            <router-link :to="'/article/'+item.id" class="recommendArtcle-item-title"  >
              <span >{{item.title}}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
  </div>

</template>

<style scoped lang="less">
@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
.recommendBar{
  //margin-left: 24px;
  padding-left: 24px;
  width: 300px;
  background: rgba(@theme-background-color,.95);
  border-radius: 16px;
  min-height: 200px;
  margin-bottom: 24px;
  svg{
    height: 28px;
    width: 28px;
  }
}
.recommendArtcle-item-title{
  text-decoration: none;
  :hover{
    color:#368CCB;
  }
}

.hover-image {
  position: absolute;
  bottom: calc(50% + 10px); /* 放在文字上方10px处 */
  right: calc(40px);
  transform: translateX(-50%);
  max-width: 240px;
  max-height: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  z-index: 100;
}

.float-form{

  @media screen and (max-width: 1400px) {
    display: none;
  }
  position: fixed;
  right:40px;
}
</style>