import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import FileSystem from '../views/FileSystem.vue'

const routes = [
    {
      path:'/',
      name:'Test',
      component: FileSystem 
    }
]

const router = createRouter({
  history: createWebHistory(), //带#的用createWebHashHistory(),
  routes
})

export default router
