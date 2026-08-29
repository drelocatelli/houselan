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

// const requiresAuthMiddleware = async() => {
//   try {
//     const db = await dbService.getDb()
    
//     const result = await db.query('SELECT * FROM users WHERE isLoggedIn = 1 LIMIT 1')
    
//     if(result.values && result.values.length > 0) {
//       return true
//     }
    
//     return false
    
//   } catch(err) {
//     console.error(err)
//     return false
//   }
// }

router.beforeEach((to, from) => {
  if(to.meta.requiresAuth) {
    const isAuthenticated = true
    
    if(isAuthenticated) {
      return true
    }

    return {name: 'Home'}
  }

  return true

})

export default router
