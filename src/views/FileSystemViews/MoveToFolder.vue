<template>
    <!--动态加载-->
    <el-popover :width="500" :visible="visible" placement="bottom">
        <template #reference>
            <div>
                <el-cascader ref="cascader" :props="props" v-model='value' :options="options"
                    @change="handleCascaderChange">
                </el-cascader>
                <el-button style="margin-left: 15px;" size="small" type="primary" @click="closeSelf">关闭悬浮窗</el-button>
            </div>

        </template>
        <p :style="{ 'white-space': 'pre-wrap' }">{{ delMessage }}</p>
        <div style="text-align: right; margin: 0">
            <el-button size="small" @click="cancel" link>取消</el-button>
            <el-button type="primary" size="small" @click="submitMoveToFolder">确定</el-button>
        </div>

    </el-popover>
</template>

<script>
import axios from 'axios';
export default {
    props: ['pathNameListProp', 'selectedRowDataProp'],
    data() {
        return {
            visible: false,
            delMessage: '',
            targetPath: '',//目标文件夹路径
            targetForderID: '',//目标文件夹ID
            fatherPathNameList: this.pathNameListProp,//从父组件传来的选中文件路径
            fatherSelectedRow: this.selectedRowDataProp,//从父组件传来的选中文件ID
            //定义cascader的属性
            props: {
                lazy: true,
                lazyLoad: this.getFolderList,
                value: 'folderID',
                label: 'folderName',
                children: 'children',
                checkStrictly: true
            },
            options: [],
            value: []
        };
    },
    methods: {
        //点击节点后加载子节点，属于lazyLoad
        getFolderList(node, resolve) {
            //最顶层，增加一个初始值
            if (node.level === 0) {
                resolve([{
                    folderID: 0,
                    folderName: '文控管理',
                    leaf: false
                }])
            } else {
                let folderID = node.value;
                axios.get('http://192.168.1.9/WebService1.asmx/getFilelist?folderID=' + folderID).then(response => {
                    const childrenNode = response.data
                        .filter(item => item.type === 'folder')
                        .map(item => ({
                            folderID: item.fileID,
                            folderName: item.fileName,
                            leaf: false
                        }));
                    resolve(childrenNode);
                }).catch(error => {


                });
            }
        },
        closeSelf() {
            //清空列表
            //关闭并传参给父界面
            this.$emit('close');
        },
        handleCascaderChange(value) {
            this.delMessage = '确定将文件：\n【' + this.fatherSelectedRow.fileName + '】移动到\n【' + this.$refs['cascader'].getCheckedNodes()[0].pathLabels.join('\\') + '】吗？';
            this.visible = true;
            this.targetPath = this.$refs['cascader'].getCheckedNodes()[0].pathLabels.join('\\');
            this.targetForderID = value[value.length - 1];
            //console.log("目标移动文件夹"+this.delMessage);
            //console.log("目标移动ID"+value[value.length-1]);
        },
        //取消
        cancel() {
            this.visible = false;
            //console.log(this.fatherPathNameList.join('\\'));
            //console.log(this.fatherSelectedRow.fileID);
            //console.log(this.targetPath);
            //console.log(this.targetForderID);
        },
        //确定，提交移动文件到目标文件夹
        submitMoveToFolder() {
            //完整的文件路径
            let sourcePath = this.fatherPathNameList.join('\\').replace('首页', '文控管理') + '\\' + this.fatherSelectedRow.fileName;
            let params = new URLSearchParams();
            params.append('sourceFileID', this.fatherSelectedRow.fileID);
            params.append('sourcePath', sourcePath);
            params.append('targetFolderId', this.targetForderID);
            //完整的目标路径，包含文件名
            params.append('targetPath', this.targetPath + '\\' + this.fatherSelectedRow.fileName);
            // console.log(params.toString());
            let url = 'http://localhost:11789/WebService1.asmx/MoveFileToFolder'
            axios.post(url, params).then(response => {
                this.$message.success(response.data);
                this.value = []; // 清空 el-cascader 的选中值
                this.closeSelf();
            }).catch(error => {
                let errorMessage = "";
                //获得服务器响应后的错误
                if (error.response) {
                    errorMessage = '文件夹创建错误：代码' + error.response.status + '【' + error.response.data + '】';
                }
                //发送请求没有得到回应
                else if (error.request) {
                    errorMessage = '请求错误：' + error.request;
                }
                //发送请求失误
                else {
                    errorMessage = '其他错误：' + error.message;
                }
                this.$message.error({
                    message: errorMessage,
                    duration: 7000
                });
            });
            this.visible = false;
            //params.add('sour')
            //axios.post()
        }
    },
    //监听父组件的文件路径和文件ID
    watch: {
        pathNameListProp(newValue) {
            this.fatherPathNameList = newValue;
        },
        selectedRowDataProp(newValue) {
            this.fatherSelectedRow = newValue;
        }

    }
}
</script>

<style></style>