import { useState } from 'react'
import { Form, Input, Button, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { LOGIN_URL, USER_INFO_URL } from '../config/API'
import { setSessionItem, ErrorInfo } from '../util'
import axios from 'axios'
import '../scss/Longin.scss'
/**
 * 登录组件
 */
const Login = ({ history }) => {
    const [errorMsg, setErrorMsg] = useState("")
    const [error, setError] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const onFinish = async (values) => {
        setLoaded(true)
        const postData = new URLSearchParams()
        postData.append('username', values.username)
        postData.append('password', values.password)
        postData.append('scope', 'read')
        postData.append('grant_type', 'password')
        postData.append('client_id', 'app50jia')
        postData.append('client_secret', '50jia123456')
        postData.append('si', '54978e5207ba373fa76617dc56a2d279b96b0e17')
        try {
            const data = await axios.request({
                url: LOGIN_URL,
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf8',
                    'Authorization': 'Basic YXBwNTBqaWE6NTBqaWExMjM0NTY='
                },
                data: postData
            })
            const userInfo = await axios.request({
                url: USER_INFO_URL,
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf8',
                    'Authorization': `Bearer ${data.data.access_token}`
                }
            })
            setLoaded(false)
            setSessionItem({
                access_token: data.data.access_token,
                userInfo: JSON.stringify(userInfo.data.data)
            })
            history.replace('/')
        } catch (error) {
            setError(true)
            setLoaded(false)
            setErrorMsg(ErrorInfo[error.response ? error.response.status : 999])
        }
    }

    const onFinishFailed = errorInfo => console.log('Failed:', errorInfo)

    return (
        <div id='menuTop'>
            <div className="mountNodeBox">
                <h2> 五十家业务管理平台</h2>
                <div id="mountNode" >
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={(event) => onFinish(event)}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item>{error ? <Alert message={errorMsg} type="error" showIcon /> : ''}</Form.Item>
                        <Form.Item name="username" className="userNameBox" >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item name="password" className="userKeyBox" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
                        </Form.Item>
                        <Button type="button" loading={loaded} htmlType="submit" >登录</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login