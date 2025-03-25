import { createRouter, createWebHistory } from 'vue-router'
import FileListView from '@/components/FileListView.vue'
import LoginView from "@/components/LoginView.vue";
import RegisterView from "@/components/RegisterView.vue";
import UserView from "@/components/UserView.vue";
import Article from "@/components/Article.vue";
import ArticleWrite from "@/components/ArticleWrite.vue";
import ArticleList from "@/components/ArticleList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      default: true,
      meta: { requiresAuth: true },
      component: FileListView,
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
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if ( (to.name === 'login' || to.name==='register') && token!==null) {
    next('/'); // 如果已经登录
  }
  else if (to.meta.requiresAuth && !token) {
    next('/login'); // 如果需要登录且没有 token，跳转到登录页面
  } else {
    next(); // 否则继续导航
  }
});

export default router
