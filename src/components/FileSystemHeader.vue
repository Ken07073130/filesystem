<template>
    <el-header class="el-header-top">
        <el-image src="/img/logo.png" style=" width: 142px; height: 30px;"></el-image>
    </el-header>
</template>

<style>
.el-header-top {
    display: flex;
    align-items: center;
    justify-content: start;
    z-index: 1;
    height: 50px !important;
    /* 强制渲染高度50px */
    line-height: 50px !important;
    /* 确保行高和高度一致，用于垂直居中文本 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    /* 提供了一个轻微的阴影效果 */
}
</style>
