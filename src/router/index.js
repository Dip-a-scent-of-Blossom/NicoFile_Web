import { createRouter, createWebHistory } from 'vue-router'
import FileListView from '@/components/FileListView.vue'
import LoginView from "@/components/LoginView.vue";
import RegisterView from "@/components/RegisterView.vue";
import UserView from "@/components/UserView.vue";
import Article from "@/components/Article.vue";
import ArticleWrite from "@/components/ArticleWrite.vue";
import ArticleList from "@/components/ArticleList.vue";
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {jwtDecode} from "jwt-decode";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      default: true,
      meta: { requiresAuth: false },
      component: ArticleList,
    },
    {
      path: '/login',
      name: 'login',
      component:LoginView
    },
    {
      path: '/register',
      name: 'register',
      component:RegisterView,
    },{
      path: '/user',
      name: 'user',
      meta: { requiresAuth: true },
      component:UserView,
    },{
      path:'/list',
      name:'list',
      meta: { requiresAuth: true },
      component:FileListView
    },{
      path:'/article/:id',
      name:'article',
      meta: { requiresAuth: false },
      component:Article
    },{
      path:'/article',
      name:'articleWrite',
      meta: { requiresAuth: true },
      component:ArticleWrite
    },{
      path:'/articles',
      name:'articleList',
      meta: { requiresAuth: false  },
      component:ArticleList,
    }
  ],
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  // if ( (to.name === 'login' || to.name==='register') && token!==null) {
  //   next('/'); // 如果已经登录
  // }
  // else
  if (to.meta.requiresAuth ===true) {
    if (token !== null ) {
      try{
        const res =await axios.post(local + "api/v1/user/loadtoken", {
        },{
          headers: {
            "Authorization": token,
          }
        })
        let jwtDecodeVal = jwtDecode(token);
        if (res.status === 200) {
          if (res.data.error===false){
            localStorage.setItem("username",res.data.username)
            // user.setNew(token,res.data.username,'',jwtDecodeVal.id)
          }else{
            localStorage.removeItem("token")
            next('/login');
            // router.push("/login")
          }
        }else{
          if (res.status === 401){
            localStorage.removeItem("token")
            next('/login');
          }else{

          }
        }
      }catch( error){
        // router.push("/login")
      }
    }else{
      next('/login'); // 如果需要登录且没有 token，跳转到登录页面
    }

  }
  next(); // 否则继续导航
});

export default router
