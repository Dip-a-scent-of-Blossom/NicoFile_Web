<script setup>

import {calc, deletefile, download, fmtDownloadTimes, local} from "@/assets/js/file.js";
import {onMounted, ref} from "vue";
import Route from "@/router/index.js";
import axios from "axios";
import router from "@/router/index.js";
import {userStore} from "@/assets/js/store.js";
import {ElNotification} from "element-plus";
import RecommendArtcle from "@/components/side/recommendArtcle.vue";
import {Star, View} from "@element-plus/icons-vue";

const FindList = ref([])
// FindList.value = [
//     {
//     "id":1,
//     "title":"文章标题t1",
//     "content":"文章内容c1",
//     "authorname":"作者a1",
//     "authorid":"1",
//     "view":24,
//     "like":0,
//     },
//     {
//     "id":2,
//     "title":"文章标题t2",
//     "content":"文章内容c2",
//     "authorname":"作者a1",
//     "authorid":"1",
//     "view":22,
//     "like":0,
//     }
// ]
const auth = ref('')
const totPage = ref(1)
const currentPage = ref(1)
const pagesize = ref(10)
const user = userStore()
async function handleCurrentChange(val) {
  // await Router.push("/?p=" + val)
  await Route.push({path:'/search',query: {p:val,keyword:Route.currentRoute.value.query.keyword}})
}
async function GetArticleList(page,keyword) {
  let res = null
  try {
    res = await axios.post(local + "/api/v1/article/search", {
      page: page,
      size: 20,
      keyword: keyword,
    }, {
      headers: {
        "Authorization": localStorage.getItem("token"),
      },
    })
  }catch (e) {
    console.log(e)
  }
  if (res.status === 401){
    localStorage.removeItem("token")
    user.$reset()
    router.push("/login")
    return
  }else if (res.status === 200) {
    FindList.value = res.data.list
  }else{
    ElNotification(
        {
          title: '错误',
          message: '获取文件列表失败,服务器错误',
          type: 'error',
          duration: 2000
        }
    )
    return
  }
  totPage.value = res.data.allpages
  currentPage.value = res.data.page
}
onMounted(async ()=>{
  let size = Route.currentRoute.value.query.size
  let page = Route.currentRoute.value.query.p
  // console.log(page,size)
  if (page === undefined || page === null || page === '' || page === 0) {
  }else{
    currentPage.value = Number(page)
  }
  if (pagesize === undefined || pagesize === null || pagesize === '' || pagesize === 0) {
  }else{
    pagesize.value = Number(size)
  }
  auth.value = localStorage.getItem("token")
  await GetArticleList(currentPage.value,Route.currentRoute.value.query.keyword)
})

</script>

<template>
  <div class="container" style="display: flex;width: 100%;margin-top: 15px" >
    <el-backtop :right="50" :bottom="50" style="color:#000000;">
      <el-icon><ArrowUpBold /></el-icon>
    </el-backtop>
    <div class="normal-container">
      <div v-if="!FindList ||  FindList.length === 0" >
        <article>
          <h1>文章列表</h1>
        </article>
        <span>没有找到对应的文章>.<</span>
      </div>
      <div v-else style="width: auto" >
        <div v-for="(item,index) in FindList" :key="item.id" class="articlePreview" >
          <div slot="header"  style="margin-bottom: 8px">
            <router-link :to="'/article/'+item.id" class="titleLink is-size-4" style="color:#368CCB">{{ item.title }}</router-link>
          </div>
          <div style="display: flex">
            <el-image style="width: 100px; height: 100px" :src='local+"/api/v1/img/download/"+item.cover' v-if="item.cover!==null" fit="cover" />
            <span class="two-line-ellipsis">
                        {{ item.content }}
                </span>
          </div>
          <div class="info is-size-5">
            <span> {{ item.authorname }}</span>
            <span> {{ item.createdat }}</span>
            <span>
                <el-icon ><View /></el-icon>
                  {{ item.view }}
                </span>
            <span>
                <el-icon><Star /></el-icon>
                  {{ item.like }}
                </span>

          </div>
        </div>
        <div
            class="container"
            style="text-align: center;bottom:0"
        >
          <el-pagination
              :current-page="currentPage"
              :page-size="1"
              :pager-count="7"
              layout="prev, pager, next"
              :total="totPage"
              @current-change="handleCurrentChange"
          >

          </el-pagination>
        </div>
      </div>
    </div>
    <div style="width: 300px;">
      <div >
      </div>
    </div>

    <RecommendArtcle>

    </RecommendArtcle>
  </div>

</template>

<style scoped lang="less">
@import "../assets/css/container.less";
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";

.articlePreview{
  background-color: rgba(@theme-background-color,0.85);
  padding:12px 12px 12px 12px;
  margin-top: 16px;
  border-radius: 16px;
  width: auto;
}

.normal-container{
  min-width:min(100%, 900px);
  max-width: min(100%, 900px);
  margin:20px  auto;

  padding: 0;
}
.titleLink{
  &:hover{
    color:#ff6600 !important;
  }
}
.two-line-ellipsis {
  margin: 16px 0 16px 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 100px);

}

.info{
  span{
    margin-right: 8px;
  }
  margin-top: 24px;
}

</style>