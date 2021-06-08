import {useState} from 'react'
import FitForm from '../../common/FitForm'
import {message} from 'antd'
import {UPDATE_PASSWORD_URL} from "../../config/API";
import {getSessionItem,useInfo} from "../../util";
import {useHistory} from 'react-router-dom'
import axios from 'axios'

const Pwd = () => {
    const history = useHistory()
    const [loading,setLoading] = useState(false)

    const onFinish = async (values) => {
        setLoading(true)
        const postData = new URLSearchParams()
        postData.append('oldPassword', values.oldPassword)
        postData.append('password', values.newPassword)
        postData.append('password2', values.resetPassword)

        if (!values.oldPassword) {
            message.info('请输入原密码!!!');
            return;
        }
        if (!values.newPassword || values.newPassword.length < 6 || values.newPassword.length > 18) {
            message.info('请输入新密码,密码长度在6-18位');
            return;
        }
        if (!values.resetPassword || values.resetPassword.length < 6 || values.resetPassword.length > 18) {
            message.info('请输入重复新密码,密码长度在6-18位');
            return;
        }
        if (values.resetPassword !== values.newPassword) {
            message.info('两次输入的新密码不一致!!!');
            return;
        }
        const pwdData = await axios.request({
            url: UPDATE_PASSWORD_URL,
            method: "POST",
            headers: {
                'Authorization': `Bearer ${getSessionItem("access_token")}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            data: postData
        })

        if (pwdData.data.code === 200) {
            message.info(pwdData.data.message);
            sessionStorage.clear()
            history.replace('/')
        } else {
            message.info(pwdData.data.message);
            setLoading(false)
        }
    }


    return (<FitForm dataSource={useInfo} onFinish={onFinish} loading={loading} />)
}

export default Pwd