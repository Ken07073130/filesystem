<template>
    <div>
        <el-table v-loading="loading" element-loading-text="加载中" :data="tableData" style="width: 100%">
            <el-table-column prop="groupID" label="组ID" width="100" />
            <el-table-column prop="groupName" label="用户组" width="100" />
            <el-table-column label="文件夹权限" width="350">
                <template v-slot="{ row, $index }">
                    <el-cascader style="width: 100%;" :options="options" :props="props" v-model="row.folderPath"
                        collapse-tags collapse-tags-tooltip />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template v-slot="{ row, $index }">
                    <el-button type="primary" icon="Edit" size="small"
                        @click="editFolderPermission(row.groupID)">编辑</el-button>
                    
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { httpService } from '@/utils/httpService'

export default {
    data() {
        return {
            loading:true,
            tableData: [],
            //定义cascader的属性
            props: {
                value: 'value',
                label: 'label',
                children: 'children',
                multiple: true
            },
            value: [],
            options: [],

        };
    },
    methods: {
        //设置cascader的默认值，即显示改用户组对哪些文件夹有权限
        setRowFolderPath(options, folderGroup) {
            let curRowValue = [];
            for (let selectedValue of folderGroup.split(',')) {
                //必须转换为数字
                selectedValue = Number(selectedValue);
                for (let option of options) {
                    if (option.value === selectedValue) {
                        curRowValue.push([selectedValue]);
                        //return curRowValue;
                    }
                    if (option.children) {
                        //如果有多层文件夹权限就要写递归，这里写死，因为只有2层
                        for (let childOption of option.children) {
                            if (childOption.value === selectedValue) {
                                curRowValue.push([option.value, selectedValue]);
                                // return curRowValue;
                            }
                            //console.log('child:'+childOption.value);
                        }
                    }
                }
            }
            return curRowValue;
        },
        //填充EL表格，内容为文件夹的权限列表
        getFolderPerssionForElTable(groupID) {
            return new Promise((resolve, reject) => {
                httpService.get('/getFolderPermission?groupID=' + groupID)
                    .then(response => {
                        this.tableData = response.data.map(item => {
                            // 解析 folderPath 字符串为数组,默认的为字符串，需要转译成数组
                            let folderPath = [];
                            try {
                                folderPath = this.setRowFolderPath(this.options, item.folderGroup);//this.setRowValue();//JSON.parse(item.folderPath);
                            } catch (e) {
                                console.error("解析 folderPath 出错:", e);
                            }

                            // 确保 folderPath 是一个二维数组
                            return {
                                ...item,
                                folderPath: folderPath
                            };
                        });
                        this.loading=false;
                        resolve(true);
                    })
                    .catch(error => {
                        console.error("获取信息失败:", error);
                        this.loading=false;
                        reject(false);
                    });
            });
        },
        //初始化cascader的下拉列表，默认只填充两层，后台已经写好递归，通过sql语句控制只显示2层，后期可以扩展
        getFolderTreeForCascader() {
            return new Promise((resolve, reject) => {
                httpService.get('/getFolderTree')
                    .then(response => {
                        this.options = response.data;
                        resolve(true);
                    });
            });
        },
        //编辑事件
        editFolderPermission(groupID) {
            this.$router.push({ path: '/fshome/fpedit', query: { groupID: groupID } });
        }
        /*对选中值去重，这个页面用不到
        handleChange(value) {
            console.log(value); // 输出去重后的选中节点ID数组
            // value 将是一个二维数组，其中每个子数组是一个选中的路径的节点ID
            let selectedNodeIds = [];
            value.forEach(pathArray => {
                // 合并所有路径数组中的节点ID到一个单一数组中
                selectedNodeIds = selectedNodeIds.concat(pathArray);
            });
            // 由于可能有重复的ID，我们使用 Set 来去重
            selectedNodeIds = [...new Set(selectedNodeIds)];

            console.log(selectedNodeIds); // 输出去重后的选中节点ID数组
        }*/


    },
    mounted() {
        this.getFolderTreeForCascader().then(success =>{

            this.getFolderPerssionForElTable(0);
        });

    }
}
</script>

<style></style>