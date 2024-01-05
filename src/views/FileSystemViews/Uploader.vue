<template>
    <el-upload class="upload-demo" ref="uploadRef" action="#" :on-success="handleSuccess" :on-error="handleError"
        :before-upload="beforeUpload" :auto-upload="false" v-model:file-list="fileList">
        <template #trigger>
            <el-button type="primary">选择文件</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload">
            上传到服务器
        </el-button>
        <template #tip>
            <div class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过 500kb
            </div>
        </template>
    </el-upload>
</template>
  
<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { httpService } from '@/utils/httpService'
import { defineEmits } from 'vue';

const fileList = ref([]);
const uploadUrl = 'http://192.168.1.9/Webservice1.asmx/uploadFile'; // 替换为你的上传 URL
const uploadRef = ref(null);

const emit=defineEmits(['close']);

// 定义 props
const props = defineProps({
    pathNameListProp: Array,
    pathIDListProp: Array
});

const beforeUpload = (file) => {
    // 在这里可以添加文件大小或类型的检查
    const isLt500KB = file.size / 1024 / 1024 < 0.5;
    if (!isLt500KB) {
        ElMessage.error('上传文件大小不能超过 500kb!');
        return false;
    }
    return true; // 返回 false 则停止上传
};

const submitUpload = () => {
    const formData = new FormData();
    fileList.value.forEach((file) => {
        formData.append('file', file.raw);
    });

    const folderPath = props.pathNameListProp.join('\\').replace('首页', '文控管理');
    console.log(folderPath)
    const folderID = props.pathIDListProp[props.pathIDListProp.length - 1];
    console.log(folderID)
    formData.append('folderPath', folderPath);
    formData.append('folderID', folderID);

    httpService.post('/uploadFile',formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response=>{
        ElMessage.success('文件上传成功！');
        fileList.value = []; // 清空文件列表
        emit('close');
    })
    /*axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(response => {
            ElMessage.success('文件上传成功！');
            fileList.value = []; // 清空文件列表
        })
        .catch(error => {
            ElMessage.error('文件上传失败！');
            console.error('Upload Error:', error);
        });*/
};

const handleSuccess = (response, file, fileList) => {
    // 处理上传成功的回调
};

const handleError = (err, file, fileList) => {
    // 处理上传失败的回调
    ElMessage.error(`文件上传失败: ${err}`);
};


</script>

  
<style scoped>
.upload-demo .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    padding: 15px;
    cursor: pointer;
}

.upload-demo .el-upload:hover {
    border-color: #409eff;
}
</style>