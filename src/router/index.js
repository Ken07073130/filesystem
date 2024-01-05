import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import FileSystem from '../views/FileSystem.vue'
import FolderPermission from '../views/FileSystemViews/FolderPermission'

const routes = [
    {
      path:'/',
      name:'Test',
      component: FileSystem 
    },{
      path:'/fp',
      name:'Test1',
      component: FolderPermission 
    }
]

const router = createRouter({
  history: createWebHistory(), //带#的用createWebHashHistory(),
  routes
})

export default router
