<template>
    <el-menu style="height: 100%;" active-text-color="#ffd04b" background-color="#2b384d" class="el-menu-vertical-demo" default-active="2"
        text-color="#fff">
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>导航一</span>
            </template>
            <el-menu-item-group title="Group One">
                <el-menu-item index="1-1">项目一</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
                <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <span>导航一</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <el-icon>
                <document />
            </el-icon>
            <span>导航一</span>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <span>导航一</span>
        </el-menu-item>
    </el-menu>
</template>