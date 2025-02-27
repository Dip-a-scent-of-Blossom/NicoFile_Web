<script setup>
import {onMounted, ref} from "vue";
import {userStore} from "@/assets/js/store.js";
import {FetchArticle} from "@/assets/js/article.js";
const user = userStore()
const article = ref([
  {
    title: '文章标题a',
    link: '/?p=1',
  },
  {
    title: '文章标题b',
    link: '/?p=2',
  },
])
onMounted(async () => {
  // const res = await FetchArticle()
  console.log('mounted')
})
</script>

<template>
  <div class="recommendBar">

    <div class="recommendArtcle">
      <div class="recommendArtcle-title">
        <h2>推荐文章</h2>
      </div>
      <div v-for="(item, index) in article" :key="item.id">
        <div>
          <span style="margin-right: 10px;color:#f0f0f0 ">{{index+1}}</span>
          <router-link :to="item.link" class="recommendArtcle-item-title" >
            <span >{{item.title}}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
.recommendBar{
  @media screen and (max-width: 1300px) {
    display: none;
  }
  width: 300px;
}
.recommendArtcle-item-title{
  text-decoration: none;
  :hover{
    color:#368CCB;
  }
}
</style>