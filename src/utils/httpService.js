import axios from 'axios'
import { ElMessage } from 'element-plus'

export const httpService = axios.create({
    //设置基础baseUrl
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000
});


/* 请求拦截器
httpService.interceptors.request.use(config => {
    // 这里可以添加全局的请求发送前的配置或处理逻辑，比如设置token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    // 请求错误处理
    Message.error(`请求失败: ${error.message}`);
    return Promise.reject(error);
});*/


// 响应拦截器
httpService.interceptors.response.use(response => {
    // 这里可以添加全局的响应处理逻辑
    return response;
}, error => {
    // 响应错误处理
    let errorMessage = "网络请求异常，请稍后重试！";
    if (error.response) {
        errorMessage = `请求错误 ${error.response.status}: ${error.response.statusText},${error.response.data}`;
    } else if (error.request) {
        errorMessage = `请求未响应: ${error.request}`;
    } else {
        errorMessage = `请求设置错误: ${error.message}`;
    }
    ElMessage.error(errorMessage);
    return Promise.reject(error);
});