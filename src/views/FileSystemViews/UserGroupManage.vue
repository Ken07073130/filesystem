<template>
    选择用户组：
    <el-select v-model="value" placeholder="请选择用户组" @change="handleSelectChange">
        <el-option v-for="item in options" :key="item.gruopID" :label="item.groupName" :value="item.groupID">
        </el-option>
    </el-select>
    <div style="margin-top: 15px; padding: 5px;margin-bottom: 15px; ">
        <el-transfer v-model="selectedKeys" :data="userList" :titles="['人员', transferRightTitle]"
            :props="{ key: 'oid', label: 'userName' }" filter-placeholder="输入姓名可搜索" filterable>
        </el-transfer>
    </div>
    <div style="margin: 15px;">
        <el-button @click="backToList">返回列表</el-button>
        <el-button type="primary" style="margin-left: 15px;" @click="submitUserGroup">保存权限</el-button>
    </div>
</template>
  
<script>
import { httpService } from '@/utils/httpService'

export default {
    data() {
        return {
            value: '',
            transferRightTitle: '组成员',
            selectedLabel: '',
            selectedKeys: [], // 存储目标列表中的项
            userList: [],
            options: [],
            groupID: -1,
        };
    },
    methods: {
        //给穿梭框赋
        getUserGroupForElTransfer(groupID) {
            httpService.get('/getUserGroup?groupID=' + groupID)
                .then(response => {
                    this.userList = response.data.userList;
                    this.selectedKeys = JSON.parse(response.data.selectedKeys);
                });
        },
        //获取用户组
        getFolderPermissionForElSelect() {
            httpService.get('/getFolderPermission?groupID=0')
                .then(response => {
                    this.options = response.data;
                });
        },
        //选择用户组
        handleSelectChange(val) {
            //console.log(val);
            this.getUserGroupForElTransfer(val);
            const option = this.options.find(option => option.groupID == val);
            this.transferRightTitle = option.groupName + ' 组成员';
            this.groupID=val;
            console.log(this.groupID);            
        },
        //返回列表
        backToList(){
            this.$router.push('/');
        },
        //提交数据到后台
        submitUserGroup(){
            let params=new URLSearchParams();
            params.append('groupID',this.groupID);
            params.append('userIDListString',this.selectedKeys.join());
            console.log(this.groupID);
            console.log(this.selectedKeys.join());
            httpService.post('/setUserGroup',params)
                       .then(response =>{
                            if(response.data==='修改成功'){
                                this.backToList();
                            }
                       });


        }
    },
    mounted() {
        //this.getUserGroupForElTransfer(0);
        this.getFolderPermissionForElSelect();
    }
};
</script>