<template>
    <el-container style="height:100%">
        <el-header class="el-header-top">
            <!-- 这里是顶部导航区域 -->
            <el-image style="width: 150px; height: 30px;" src="/img/logo.png"></el-image>
            <span style="margin-left: 3px;" v-for="(item, index) in pathNameList" :key="index">
                <el-button size="small" :type="buttonTypes[index % 5]" text bg @click="goToPage(index)">
                    {{ item }}</el-button>
                <el-icon style="margin-left: 3px;" :size="12" v-if="index < pathNameList.length - 1">
                    <ArrowRight />
                </el-icon>
            </span>

            <el-text style="margin-left: 15px;" v-if="false">←点击左侧标签可直接进入文件夹</el-text>
        </el-header>
        <el-container
            style=" width: 100%;margin-left: auto;margin-right: auto; border: 1px solid #eee; display: flex; height: 90vh;">
            <el-aside width="8vw">
                <!-- 这里是侧边栏区域 -->
                <FileSystemMenu></FileSystemMenu>
            </el-aside>
            <el-container>
                <el-header style="margin-top: 15px; height: 50px; line-height: 50px; ">
                    <el-button icon="Upload" round type="primary" size="large" style="margin-right: 15px;"
                        @click="toggleUploadDialog('show')">上传</el-button>
                    <el-button-group>
                        <el-button icon="ArrowLeft" @click="goToPage(pathIDList.length - 2)"
                            style="border-top-left-radius: 15px;border-bottom-left-radius: 15px;">返回上一页</el-button>
                        <el-button icon="Refresh" @click="goToPage(pathIDList.length - 1)">刷新</el-button>
                        <el-button icon="FolderAdd" style="border-top-right-radius: 15px;border-bottom-right-radius: 15px"
                            @click="toggleCreateFolder('create')">新建文件夹</el-button>
                    </el-button-group>

                    <el-popover :width="400" :visible="moveToFolderVisble" placement="bottom">
                        <template #reference>
                            <el-button style="margin-right: 16px" type="primary" @click="checkRowData">移动</el-button>
                        </template>
                        <MoveToFolder :pathNameListProp="pathNameList" :selectedRowDataProp="selectedRowData"
                            @close="toggleMoveToFolderDialog('close')"></MoveToFolder>
                    </el-popover>

                </el-header>
                
                    <el-main>
                        <!--表格显示部分-->
                        <el-table :data="tableData" style="overflow-y: auto;height:90%;width: 90vw; border-radius: 20px"
                            highlight-current-row @current-change="handleCurrentChange">
                            <el-table-column label="文件名" sortable width="600">
                                <template v-slot="{ row, $index }">
                                    <!--新增行时显示编辑-->
                                    <div v-if="row.rowEditable">
                                        <el-button icon="Folder" size="small" circle></el-button>
                                        <el-input v-model="row.editFolderName" size="small"
                                            style="width: 300px;margin-right: 10px;margin-left: 10px;"></el-input>
                                        <el-button type="primary" icon="Check" size="small"
                                            @click="postFolderCreation(row)"></el-button>
                                        <el-button type="primary" icon="Close" size="small"
                                            @click="toggleCreateFolder('cancel')"></el-button>
                                    </div>
                                    <div v-else style="display: flex; align-items: center;"
                                        @mouseenter="toggleCellHoverRowIndex($index, row.type, 'enter')"
                                        @mouseleave="toggleCellHoverRowIndex($index, row.type, 'leave')">
                                        <el-image :src="getFileImgSrc(row.fileName, row.type)"
                                            style="width: 30px;height: 30px;"></el-image>
                                        <el-link :underline="false" style="margin-left: 10px;"
                                            @click="openFolderOrPreviewFile(row.fileName, row.type, row.fileID)">{{
                                                row.fileName
                                            }}</el-link>
                                        <el-button style="margin-left: auto;" size="small" icon="Download"
                                            @click="downloadFile(row.fileName)" type="primary"
                                            v-if="$index === this.hoverRowIndex">下载</el-button>
                                        <span style="margin-left: auto; ">{{ row.fileID }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="editTime" label="日期" sortable width="180"></el-table-column>
                            <el-table-column prop="fileSize" label="大小" sortable width="80"></el-table-column>
                        </el-table>

                    </el-main>
            </el-container>
        </el-container>
    </el-container>

    <!-- 预览文件弹出框 -->
    <el-dialog v-model="previewFileVisible" width="80%">
        <!-- PDF Embed -->
        <embed v-if="!isImgBlod" :src="blobUrl" style="width:100%; height: 65vh;">
        <!-- image Embed 使用Embed显示图片容易白屏-->
        <img v-if="isImgBlod" :src="blobUrl" style="width:100%; height: 65vh;">
    </el-dialog>

    <!-- 上传文件弹出框 -->
    <el-dialog title="上传文件" v-model="uploadVisible" width="500px">
        <!--传入参数，子组件添加监听同步父组件的值的变化-->
        <Uploader :pathNameListProp="pathNameList" :pathIDListProp="pathIDList" @close="toggleUploadDialog('close')">
        </Uploader>
    </el-dialog>
</template>

<script>
import FileSystemMenu from '../components/FileSystemMenu.vue'
import { httpService } from '@/utils/httpService'
import { MessageBox, Message, ElLoading, ElMessage } from 'element-plus'
import Uploader from './FileSystemViews/Uploader.vue'
import MoveToFolder from './FileSystemViews/MoveToFolder.vue'

//后期删除axios，测试用
//import axios from 'axios'

export default {
    data() {
        return {
            loading: true,//通用，等待中的状态
            pathNameList: ['首页'],//数组,记录当前路径名列表
            pathIDList: [0],//数组,记录当前文件ID列表
            buttonTypes: ['primary', 'success', 'info', 'warning', 'danger', ''],//首页按钮颜色风格列表
            previewFileVisible: false,//预览文件的dialog是否可见
            uploadVisible: false,//上传文件窗口是否可见
            moveToFolderVisble: false,//移动文件夹窗口是否可见
            isImgBlod: false,//是要打开图片v-if <embed> or <img>还是其他文件
            hoverRowIndex: -1,//显示下载按钮用,鼠标移动到的行索引,hoverRowIndex===row.index则显示按钮
            selectedRowData: null,//记录当前选中行的数据
            tableData: [],
            //文件类型匹配
            fileMappings: {
                'pdf': { icon: 'pdf.png', mimeType: 'application/pdf' },
                'xls': { icon: 'excel.png', mimeType: '' },
                'xlsx': { icon: 'excel.png', mimeType: '' },
                'txt': { icon: 'txt.png', mimeType: 'text/plain' },
                'mp4': { icon: 'video.png', mimeType: 'video/mp4' },
                'mpeg4': { icon: 'video.png', mimeType: 'video/mp4' },
                'jpg': { icon: 'jpg.png', mimeType: 'image/jpeg' },
                'jpeg': { icon: 'jpg.png', mimeType: 'image/jpeg' },
                'png': { icon: 'jpg.png', mimeType: 'image/png' },
                'default': { icon: 'default.png', mimeType: '' }
            }
        };
    },
    methods: {
        //获取文件列表,填充DataTable
        getFileListForElTable(folderID) {
            // 打开加载指示器
            //console.log('fileList dy')
            return new Promise((resolve, reject) => {
                httpService.get('/getFilelist?folderID=' + folderID)
                    .then(response => {
                        this.tableData = response.data;
                        resolve(true);
                    })
                    .catch(error => {
                        console.error("获取信息失败:", error);
                        reject(false);
                    });
            });
        },
        //到指定目标页，头部路径导航、返回主页、刷新和返回上一页调用，参数index代表的是在pathIDlist中的位置
        goToPage(indexOfList) {
            //console.log(indexOfList);
            if (indexOfList < 0) { return };
            let fileID = indexOfList === 0 ? 0 : this.pathIDList[indexOfList];
            this.getFileListForElTable(fileID).then(success => {
                if (success) {
                    this.pathIDList.splice(indexOfList + 1);
                    this.pathNameList.splice(indexOfList + 1);
                }
            }).catch(error => {
                console.log('返回上级出错' + error);
            });
        },
        //点击类型为文件夹后打开文件夹,并更新pathIDList和pathNameList
        openFolder(fileID, fileName) {
            this.getFileListForElTable(fileID).then(success => {
                if (success) {
                    this.pathIDList.push(fileID);
                    this.pathNameList.push(fileName);
                }
            }).catch(error => {
                console.log("文件列表获取失败" + error.message);
            });
        },
        //预览前清空缓存
        resetPreviewCache() {
            this.blobUrl = '';
            this.isImgBlod = false;
            if (this.previewFileVisible) {
                URL.revokeObjectURL(this.blobUrl); // Clean up the object URL
                this.previewFileVisible = false;
            }
        },
        //从服务器获取二进制文件,下载模块和预览模块通用
        getBlobFile(fileName) {
            let filePath = this.pathNameList.join('\\').replace('首页', '文控管理') + '\\' + fileName;
            console.log(filePath);
            return httpService({
                url: '/downloadFile?filePath=' + filePath,
                method: 'GET',
                responseType: 'blob'
            }).then(response => {
                if (response.data.size > 0) {

                    return response.data;
                } else {
                    this.$message.error('getBlobFile error:从服务器获取的文件大小错误,空文件');
                    throw new Error('文件大小为0,无法下载');
                }
            });
        },
        //打开文件夹或者预览文件
        openFolderOrPreviewFile(fileName, type, fileID) {
            //console.log('openFolderOrPreviewFile dy' + fileID);
            //文件夹调用后台
            if (type === 'folder') {
                this.openFolder(fileID, fileName);
            } else {
                /*打开本地文件的方法，不是通过服务器接收的二进制文件
                if (filename.endsWith('.pdf')) {
                  this.src = '/文控系统/图纸';
                  //增加问号后面的随机数防止缓存
                  this.pdfUrl = this.src + '/' + filename + '?num=' + Math.random();
                  this.dialogVisible = true;
                } else {
                  MessageBox.alert('无法打开非PDF文件', '打开文件错误', {
                    confirmButtonText: '确定'
                  });
                }*/
                //增加加载中的提示
                this.loadingInstance = ElLoading.service({
                    fullscreen: true, // 使用全屏模式
                    lock: true,
                    text: '加载中', // 可选的加载文本
                    background: 'rgba(255, 255, 255, 0.7)', // 可选的背景色
                });
                this.getBlobFile(fileName).then(data => {
                    //预览前清空缓存
                    this.resetPreviewCache();
                    //console.log('处理后：' + data.size);
                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    //console.log(fileExtension);
                    //文件打开类型
                    const fileMimeType = this.fileMappings[fileExtension].mimeType;
                    //判断如果不是可处理的文件类型则直接退出
                    if (fileMimeType === '') {
                        if (this.loadingInstance) {
                            this.loadingInstance.close();
                        }
                        return
                    }
                    //console.log(fileMimeType);
                    const file = new Blob([data], { type: fileMimeType });
                    //console.log(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.blobUrl = e.target.result; // data: URL
                        this.previewFileVisible = true;
                        this.isImgBlod = fileName.toLowerCase().match(/\.(jpeg|jpg|png)$/);
                        if (this.loadingInstance) {
                            this.loadingInstance.close();
                        }

                    };
                    reader.onerror = (e) => {
                        console.error('Error reading file:', e);
                        if (this.loadingInstance) {
                            this.loadingInstance.close();
                        }
                    };
                    reader.readAsDataURL(file); // 读取文件内容
                }).catch(error => {
                    if (this.loadingInstance) {
                        this.loadingInstance.close();
                    }
                });
            }


        },
        //下载文件
        downloadFile(fileName) {
            /*这里是下载本地文件夹的方法,对于服务器并不适用
                 const link = document.createElement('a');
                 // 假设你的文件名为example.pdf, 位于public文件夹中的files子目录
                 link.href = '/文控系统/图纸/' + filename;
                 link.download = filename; // 下载后的文件名
                 document.body.appendChild(link);
                 link.click();
                 document.body.removeChild(link);*/
            //调用getBlobFile从服务器获取文件
            this.getBlobFile(fileName).then(data => {
                const url = window.URL.createObjectURL(new Blob([data]));
                // 创建一个下载链接
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); // 替换为你的文件名和格式
                // 将链接添加到DOM并触发点击事件
                document.body.appendChild(link);
                link.click();
                // 清理并移除链接

                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 1000);
                //document.body.removeChild(link);
                //window.URL.revokeObjectURL(url);
            });
        },
        //前端：在表单中新建文件夹或者取消新建文件夹
        toggleCreateFolder(action) {
            // 如果表格为空，或者rowEditable未定义，执行相关操作(新增文件夹的行只能有一行，不能重复执行)
            if (action === 'create' && (this.tableData.length === 0 || !this.tableData[0].rowEditable)) {
                const rowData = {
                    type: 'file',
                    editTime: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*/, '$1 $2'),
                    fileName: '',
                    fileID: '',
                    rowEditable: true
                }
                this.tableData.unshift(rowData);
            } else if (action === 'cancel' && this.tableData.length > 0 && this.tableData[0].rowEditable) {
                this.tableData.shift();
            }
        },
        //后端提交新建文件夹到后端
        postFolderCreation(row) {
            let url = '/createFolder';
            let folderPath = this.pathNameList.slice(1).join('/');
            let folderName = row.editFolderName;
            let parentFolderID = this.pathIDList[this.pathIDList.length - 1];

            //只有params能传输到后台
            let params = new URLSearchParams();
            params.append('folderPath', folderPath);
            params.append('folderName', folderName);
            params.append('parentFolderID', parentFolderID);

            httpService.post(url, params).then(response => {
                this.$message.success(response.data);
                this.getFileListForElTable(this.pathIDList[this.pathIDList.length - 1]);
            }).catch(error => {
                // 如果需要，这里处理错误，但对于预期的 400 错误将不会执行任何操作
                // 您可以根据需要添加日志记录或其他错误处理逻辑
                if (error.response && error.response.status !== 400) {
                    console.error('An unexpected error occurred:', error);
                }
            });
        },
        //鼠标进入行设置当前行的div，hoverRowIndex===row.index则显示下载
        toggleCellHoverRowIndex(index, type, action) {
            if (type != 'folder') {
                this.hoverRowIndex = (action === 'enter') ? index : -1;
            }
        },
        //显示/关闭上传窗口
        toggleUploadDialog(action) {
            this.uploadVisible = (action === 'show');
            //关闭窗口并刷新当前页
            if (action === 'close') {
                this.goToPage(this.pathIDList.length - 1);
            }
        },
        toggleMoveToFolderDialog(action) {
            this.moveToFolderVisble = (action === 'show');
            this.goToPage(this.pathIDList.length - 1);
        },
        //表格行变化，用于监控当前在哪一行，用于移动文件夹
        handleCurrentChange(val) {
            this.selectedRowData = val;
        },
        //点击移动文件前先要检查是否选中数据
        checkRowData() {
            if (!this.selectedRowData || Object.keys(this.selectedRowData).length === 0) {
                this.moveToFolderVisble = false;
                ElMessage.error('未选中行，请先选择行后在进行移动操作');
            } else {
                this.moveToFolderVisble = true;
            }
        },
        //设置文件图标
        getFileImgSrc(fileName, type) {
            let url = '/img/';
            // 文件夹
            if (type === 'folder') {
                url += 'folder.png';
            } else {
                // 获取文件类型
                const fileType = fileName.split('.').pop().toLowerCase();
                // 检查 fileMappings 是否包含该 fileType
                const fileMapping = this.fileMappings[fileType];
                // 如果 fileType 存在于 fileMappings 中，则使用对应的 icon，否则使用默认 icon
                url += fileMapping ? fileMapping.icon : this.fileMappings['default'].icon;
                //console.log(url);
            }
            return url;
        }
    },
    components: {
        FileSystemMenu,
        Uploader,
        MoveToFolder
    },
    mounted() {
        this.getFileListForElTable(0);
    }
};


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

.el-button-group .el-button {
    background-color: #f0faff;
    color: #06a7ff;
}
</style>