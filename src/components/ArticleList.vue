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
FindList.value = [
    {
    "id":1,
    "title":"文章标题t1",
    "content":"文章内容c1",
    "authorname":"作者a1",
    "authorid":"1",
    "view":24,
      "like":0,
    },
    {
    "id":2,
    "title":"文章标题t2",
    "content":"文章内容c2",
    "authorname":"作者a1",
    "authorid":"1",
    "view":22,
      "like":0,
    }
]
const auth = ref('')
const totPage = ref(1)
const currentPage = ref(1)
const pagesize = ref(10)
const user = userStore()
async function handleCurrentChange(val) {
  // await Router.push("/?p=" + val)
  await Route.push({path:'/list',query: {p:val}})
}
async function GetArticleList(page) {
  let res = null
  try {
    res = await axios.post(local + "api/v1/article/list", {
      page: page,
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
    console.log(res)
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
  FindList.value = res.data.list
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
  await GetArticleList(currentPage.value)
})

</script>

<template>
  <div class="container " style="display: flex;width: 100%;margin-top: 15px" >
    <el-backtop :right="50" :bottom="50" style="color:#000000;">
      <el-icon><ArrowUpBold /></el-icon>
    </el-backtop>
    <div class="normal-container"   >
      <div v-if="FindList.length ===0" >
        <article>
          <h1>文章列表</h1>
        </article>
        <span>暂无文章</span>
      </div>
      <div v-else style="width: auto" >
        <div v-for="(item,index) in FindList" :key="item.id" class="articlePreview" >
            <div slot="header"  style="margin-bottom: 8px">
                <router-link :to="'/article/'+item.id" class="titleLink is-size-6">{{ item.title }}</router-link>
            </div>
            <div >
                <span class="two-line-ellipsis">
<!--                    <el-text  truncated>-->
                        {{ item.content }}
<!--                    </el-text>-->
                </span>
            </div>
            <div class="info">
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
    <div style="margin-left:50px;">
      <div >
        <RecommendArtcle>

        </RecommendArtcle>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../assets/css/container.less";
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";

.normal-container{
  min-width:min(100%, 900px);
  margin: auto;
  padding: 0;
}
.titleLink{
    &:hover{
        color:#ff6600
    }
}
.two-line-ellipsis {
  margin: 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.articlePreview{
    background-color: @theme-background-color-light;
    padding-top: 12px;
    margin-top: 16px;
}
.info{
  span{
    margin-right: 8px;
  }
}

</style>