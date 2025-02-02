import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import LoginView from "@/components/LoginView.vue";
import RegisterView from "@/components/RegisterView.vue";
import UserView from "@/components/UserView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      default: true,
      component: HomeView,
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
      path: '/usr/:id',
        name: 'user',
      component:UserView,
    }
  ],
})

export default router
