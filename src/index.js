import "react-app-polyfill/ie9"
import "react-app-polyfill/stable"
import { ConfigProvider, Modal } from 'antd'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { render } from 'react-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { getSessionItem } from './util'
import request from './config/request'
import './scss/reset.scss'
import 'antd/dist/antd.css'
import Login from './components/Login'
import Main from './components/Main'
import NoMatch from './common/NoMatch'
moment.locale('zh-cn')
const { confirm } = Modal

const PrivateRoute = ({ component: Component }) => (
    <Route
        render={props => {
            if (getSessionItem('access_token')) {
                request.defaults.headers.common['Authorization'] = "Bearer " + getSessionItem('access_token')
                return <Component {...props} />
            } else {
                return <Redirect to={{ pathname: "/login" }} />
            }
        }
        }
    />
)

const getUserConfirmation = (pageMsg, callback) => confirm({
    icon: <ExclamationCircleOutlined />,
    title: pageMsg,
    onOk () {
        callback(true)
    },
    onCancel () {
        callback(false)
    }
})

render(
    <ConfigProvider locale={zhCN}>
        <HashRouter getUserConfirmation={getUserConfirmation}>
            <Switch>
                <Route exact path="/login" component={Login} />
                <PrivateRoute path="/" component={Main} />
                <Route component={NoMatch} />
            </Switch>
        </HashRouter>
    </ConfigProvider>,
    document.getElementById('main')
)