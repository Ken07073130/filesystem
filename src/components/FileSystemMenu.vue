<template>
    <el-menu :default-active="activeIndex" router active-text-color="#ffd04b" background-color="#2b384d" default-active="2"
        class="el-menu-vertical-demo" text-color="#fff" style="height:100%">
        <el-menu-item index="/">
            <el-icon>
                <HomeFilled />
            </el-icon>
            <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/fshome/fp">
            <el-icon>
                <Tools />
            </el-icon>
            <span>权限管理</span>
        </el-menu-item>
        <el-menu-item index="/fshome/group">
            <el-icon>
                <UserFilled />
            </el-icon>
            <span>成员管理</span>

        </el-menu-item>
        <!-- 其他菜单项 -->
    </el-menu>
</template>
  
<script>
export default {
    data() {
        return {
            activeIndex: this.$route.path // 活动菜单项的 index 应当与当前路由的 path 相匹配
        };
    },
    watch: {
        '$route'(newRoute) {
            this.activeIndex = newRoute.path; // 当路由变化时，更新活动菜单项的 index
        }
    }
};
</script>

<style scoped>
::v-deep .el-menu-item.is-active {
    background-color: rgb(34, 45, 62)
}
</style>