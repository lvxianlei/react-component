/**
 * 准备替换原有fetch用法。意图整合请求达到统一处理的目的
*/
import axios from 'axios'
import { message, Modal } from 'antd'
import { BASE_URL } from './API'
import { removeItem, ErrorInfo } from '../util'
const reqest = axios.create({
    baseURL: BASE_URL,
    timeout: 3600000,
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    transformRequest: [(data) => {
        const postData = new URLSearchParams()
        if (data && data.data && Object.keys(data).length === 1) {
            postData.append("data", JSON.stringify(data.data))
            return postData
        }
        postData.append("data", JSON.stringify(data))
        return postData
    }]
})

const refrenceLogin = () => {
    removeItem("access_token")
    window.location.replace('/login')
}

reqest.interceptors.response.use(response => {
    const { data } = response
    switch (data.code) {
        case 0:
            Modal.error({
                title: '权限',
                content: JSON.stringify(data.msg),
                okText: '登录',
                onOk: refrenceLogin
            })
            break
        case 3:
            message.error('请求错误')
            break
        case 9999 || "9999":
            message.error(data.message || '请求错误或参数错误')
            return data
        default:
            return data
    }
}, error => {
    const { message: errorMessage, code } = error
    if (code === "ECONNABORTED") {
        message.error(ErrorInfo[code])
        return Promise.reject(error)
    }
    message.error(errorMessage)
    return Promise.reject(error)
})

export default reqest

export const post = reqest.post

export const get = reqest.get

export const put = reqest.put

export const remove = reqest.delete

export const head = reqest.head

export const options = reqest.options