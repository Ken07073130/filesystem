<template>
    <el-container style="height:500px">
        <el-header class="el-header-top">
            <!-- 这里是顶部导航区域 -->
            <el-image style="width: 150px; height: 30px;" src="/img/logo.png"></el-image>
        </el-header>
        <el-container
            style=" width: 100%;margin-left: auto;margin-right: auto; border: 1px solid #eee; display: flex; height: 90vh;">
            <el-aside width="8vw">
                <!-- 这里是侧边栏区域 -->
                <FileSystemMenu></FileSystemMenu>
            </el-aside>
            <el-container style="height: 93vh;">
                 <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import FileSystemMenu from '../../components/FileSystemMenu.vue'

export default {
    data() {
        return {
            
        };
    },
    components:{
        FileSystemMenu
    }
}
</script>

<style></style>