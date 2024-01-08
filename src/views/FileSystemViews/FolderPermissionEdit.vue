<template>
    <div>
        <el-text>部门:{{ this.groupName }}</el-text>

        <div>
            <el-tree ref="myTree" style="margin-top: 15px; overflow-y: auto;border: 1px Dashed ; height: 70vh;" :data="data"
                show-checkbox default-expand-all :props="defaultProps" node-key="value" :check-strictly="false">
                <template #default="{ node, data }">
                    <span>
                        <el-image style="width: 15px; height: 15px;" src="/img/folder.png"></el-image>
                        {{ node.label }}
                    </span>
                </template>
            </el-tree>
            <div style="margin: 15px;">
                <el-button @click="backToList" >返回列表</el-button>
                <el-button type="primary" style="margin-left: 15px;" @click="submitFolderPermission">保存权限</el-button>
            </div>

        </div>

    </div>
</template>

<script>
import { httpService } from '@/utils/httpService'
export default {
    data() {
        return {
            data: [],
            //定义cascader的属性
            defaultProps: {
                value: 'value',
                label: 'label',
                children: 'children',
                multiple: true
            },
            groupID: -1,
            groupName: ''

        };
    },
    methods: {
        //初始化cascader的下拉列表，默认只填充两层，后台已经写好递归，通过sql语句控制只显示2层，后期可以扩展
        getFolderTreeForCascader() {
            httpService.get('/getFolderTree')
                .then(response => {
                    this.data = response.data;
                });
        },
        //获取值,获取的是全部的用户组的权限，过滤只要当前项目组的值
        //填充EL表格，内容为文件夹的权限列表
        getFolderPerssion(groupID) {
            return new Promise((resolve, reject) => {
                httpService.get('/getFolderPermission?groupID=' + groupID)
                    .then(response => {
                        this.groupName = response.data[0].groupName;
                        const keysToCheck = response.data[0].folderGroup.split(',').map(Number);
                        this.$refs.myTree.setCheckedKeys(keysToCheck);
                        resolve(true);
                    })
                    .catch(error => {
                        console.error("获取信息失败:", error);
                        reject(false);
                    });
            });
        },
        //提交更改
        submitFolderPermission() {
            let params = new URLSearchParams();
            //const folderGroup = this.$refs.myTree.getCheckedKeys().join();
            //获取选中的值，getCheckedKeys：选中节点，getHalfCheckedKeys：半选中节点(父节点)
            const checkedGroup=this.$refs.myTree.getCheckedKeys();
            const halfCheckGroup=this.$refs.myTree.getHalfCheckedKeys();
            const folderGroup=halfCheckGroup+','+checkedGroup;
            params.append('groupID', this.groupID);
            params.append('folderGroup', folderGroup);
            httpService.post('/setFolderPermission', params)
                .then(response => {
                    if (response.data === '修改成功') {
                        //返回列表
                        this.backToList();
                        
                    }
                })
                .catch(error => {

                });

        },
        backToList(){
            this.$router.push('/fshome/fp');
        }
    },
    mounted() {
        this.groupID = this.$route.query.groupID;
        this.getFolderTreeForCascader();
        this.getFolderPerssion(this.groupID);
    }
}
</script>