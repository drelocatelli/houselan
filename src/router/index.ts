import { db } from '@/services/database.service';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/DashboardApp.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'dashboard.index',  
        component: () => import('@/views/Dashboard/Index.vue')
      },
      
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const checkAuth = async() => {
  try {
   
    const result = await db.users.toCollection().first()

    console.log('user result', result)

    if(result?.isLoggedIn) {
      return true
    }
    
    return false
    
  } catch(err) {
    console.error(err)
    return false
  }
}

router.beforeEach(async (to) => {
  if(to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    
    if(isAuthenticated) {
      console.log('User logged in')
      return true
    }

    console.log('User not logged in')
    return {name: 'Home'}
  }

  return true

})

export default router
