import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import FileSystem from '../views/FileSystem.vue'
import FolderPermissionList from '../views/FileSystemViews/FolderPermissionList.vue'
import FileSystemConfigHome from '../views/FileSystemViews/FileSystemConfigHome.vue'
import FolderPermissionEdit from '../views/FileSystemViews/FolderPermissionEdit.vue'
import UserGroupManage from '../views/FileSystemViews/UserGroupManage.vue'


const routes = [
    {
      path:'/',
      name:'FileSystem',
      component: FileSystem 
    }, 
    {
      path:'/fshome',
      name:'fsHome',
      component: FileSystemConfigHome ,
      children: [ // 定义 FileSystem 的子路由
      {
        path: 'fp', // 注意这里不是 '/fp1'，没有斜杠表示这是一个子路由
        name: 'FolderPermissionList',
        component: FolderPermissionList
      },{
        path:'fpedit',
        name:'FolderPermissionEdit',
        component: FolderPermissionEdit 
      },{
        path:'group',
        name:'UserGroupManage',
        component: UserGroupManage 
      },]
    }
]

const router = createRouter({
  mode:'history',
  history: createWebHistory(), //带#的用createWebHashHistory(),
  routes
})

export default router
