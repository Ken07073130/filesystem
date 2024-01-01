<template>
    <el-container style="height:100%">
        <el-header class="el-header-top">
            <!-- 这里是顶部导航区域 -->
            <el-image style="width: 150px; height: 30px;" src="/img/logo.png" fit="fit"></el-image>

           
            <span style="margin-left: 3px;" v-for="(item, index) in pathNameList" :key="index">
                <el-button size="small" :type="buttonTypes[index%5]" text bg>
                {{ item}}</el-button>
                <el-icon style="margin-left: 3px;" :size="12" v-if="index < pathNameList.length - 1">
                    <ArrowRight />
                </el-icon>


            </span>

        </el-header>
        <el-container
            style=" width: 100%;margin-left: auto;margin-right: auto; border: 1px solid #eee; display: flex; height: 90vh;">
            <el-aside width="8vw">
                <!-- 这里是侧边栏区域 -->
                <FileSystemMenu></FileSystemMenu>
            </el-aside>
            <el-container>
                <el-header style="margin-top: 15px; height: 50px; line-height: 50px; ">
                    <el-button icon="Upload" round type="primary" size="large" style="margin-right: 15px;">上传</el-button>
                    <el-button-group>
                        <el-button size="medium" icon="ArrowLeft"
                            style="border-top-left-radius: 15px;border-bottom-left-radius: 15px;background-color: #f0faff;color: #06a7ff;">返回上一页</el-button>
                        <el-button size="medium" icon="Refresh"
                            style="background-color: #f0faff;color: #06a7ff;">刷新</el-button>
                        <el-button size="medium" icon="FolderAdd"
                            style="border-top-right-radius: 15px;border-bottom-right-radius: 15px;background-color: #f0faff;color: #06a7ff;">新建文件夹</el-button>
                    </el-button-group>

                </el-header>
                <el-main>
                    <el-table :data="tableData" style="overflow-y: auto;height:90%;width: 90vw; border-radius: 20px"
                        highlight-current-row>
                        <el-table-column label="文件名" sortable width="600">

                            <template v-slot="{ row, $index }">
                                <div style="display: flex; align-items: center;">
                                    <el-image src="/img/folder.png" style="width: 30px;height: 30px;" fit="fit"></el-image>
                                    <el-link :underline="false" style="margin-left: 10px;">{{ row.fileName }}</el-link>

                                    <el-button style="margin-left: auto;" size="mini" class="el-icon-download"
                                        type="primary">下载</el-button>
                                    {{ row.fileID }}
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column prop="editTime" label="日期" sortable width="150"></el-table-column>
                        <el-table-column prop="fileSize" label="大小" sortable width="80"></el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import FileSystemMenu from '../components/FileSystemMenu.vue'
import FileSystemHeader from '../components/FileSystemHeader.vue'
export default {
    data() {
        return {
            pathNameList: ['温控系统', '临时文件', '临时文件1', '临时文2', '临时文3', '临时文件4', '临时文件5'],
            pathIDList: [1, 2, 3],
            buttonTypes: ['primary', 'success', 'info', 'warning', 'danger', ''],
            tableData: [{
                fileName: '文件名1',
                fileID: 1
            },
            {
                fileName: '文件名3',
                fileID: 2
            }

            ]
        };
    },
    components: {
        FileSystemMenu,
        FileSystemHeader
    }
}

</script>


<style>
body {
    margin: 3px;
}

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

/*span循环后不居中，需要更改样式 */
.el-header-top span {
    margin: 0;
    padding: 0;
    display: inline-flex;
    /* 使得span内部也使用flex布局，有助于居中 */
    align-items: center;
    /* 确保span内部的元素也垂直居中 */
}

/*适应手机屏幕做适配*/
@media (max-width: 768px) {
    .el-aside {
        /* 在手机上隐藏侧边栏或使其可折叠 */
        display: none;
    }

    .el-button {
        font-size: 10px;
        /* 增加字体大小 */
        padding: 10px;
        /* 调整填充以适应文本 */
        /* 可能还需要调整其他样式以保证布局和可见性 */
    }

}
</style>
  
<style scoped>
.el-submenu .el-menu-item {
    min-width: 150px;
}
</style>