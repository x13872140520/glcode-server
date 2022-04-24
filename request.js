/*
 * @Author: your name
 * @Date: 2022-04-22 14:09:59
 * @LastEditTime: 2022-04-22 16:54:09
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mac/vite/vite-dmeo/src/utils/request.js
 */
import Axios from 'axios'
import { message } from 'antd';
import axiosRetry from 'axios-retry'



const paddingMap = new Map()

//配置请求头
let headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json'
}


//环境的切换

if (process.env.NODE_ENV == 'development') {
    Axios.defaults.baseURL = 'http://localhost:10086/';
} else if (process.env.NODE_ENV == 'debug') {
    Axios.defaults.baseURL = 'http://localhost:10086/';
} else if (process.env.NODE_ENV == 'production') {
    Axios.defaults.baseURL = 'http://localhost:10086/';
}

//请求超时的时间


//错误的状态码

const httpErrorStatusHandle = (error) => {
    let messagetitle = ""
    if (error && error.response) {
        switch (error.response.status) {
            case 302: messagetitle = '接口重定向了！'; break;
            case 400: messagetitle = '参数不正确！'; break;
            case 401: messagetitle = '您未登录，或者登录已经超时，请先登录！'; break;
            case 403: messagetitle = '您没有权限操作！'; break;
            case 404: messagetitle = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
            case 408: messagetitle = '请求超时！'; break;
            case 409: messagetitle = '系统已存在相同数据！'; break;
            case 500: messagetitle = '服务器内部错误！'; break;
            case 501: messagetitle = '服务未实现！'; break;
            case 502: messagetitle = '网关错误！'; break;
            case 503: messagetitle = '服务不可用！'; break;
            case 504: messagetitle = '服务暂时无法访问，请稍后再试！'; break;
            case 505: messagetitle = 'HTTP版本不受支持！'; break;
            default: messagetitle = '异常问题，请联系管理员！'; break
        }
        if (error.message.includes('timeout')) messagetitle = '网络请求超时！';
        if (error.message.includes('Network')) messagetitle = window.navigator.onLine ? '服务端异常！' : '您断网了！';

        message.error(messagetitle)
    }


}

//生成每个请求唯一key
const getKey = (confing) => {
    let { url, methods, params, data } = confing

    if (typeof data === 'string') {
        data = JSON.parse(data)
    }
    return [url, methods, JSON.stringify(params), JSON.stringify(data)].join("&")


}
//存储请求

const addPending = (config) => {
    const pendingKey = getKey(config)
    config.cancelToken

}
// 删除重复的请求
const removePending = (config) => {
    const pendingKey = getKey(config)
    if (paddingMap.has(pendingKey)) {
        const cancelToken = paddingMap.get(pendingKey)
        cancelToken(pendingKey)
        paddingMap.delete(pendingKey)
    }
}

export const CreatAxios = (axiosConfig) => {

    const service = Axios.create({
        baseURL: "http://localhost:10086/",
        timeOut: 10000,    //设置超时的时常   
        headers
    })

    //添加请求拦截器

    service.interceptors.request.use(function (config) {
        //先删除重复的请求
        removePending(config)

        //然后判断取消重复请求是否开启
        addPending(config)





        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 响应拦截器
    service.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        removePending(response.config)


        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }



    }, function (error) {
        // 对响应错误做点什么

        error => {
            error.config && removePending(error.config);
            httpErrorStatusHandle(error); // 处理错误状态码
            return Promise.reject(error); // 错误继续返回给到具体页面
        }

        return Promise.reject(error);
    });

    return service(axiosConfig)
}




