import { Result } from 'antd'
import { ErrorInfo } from '../util'

const NoMatch = ({ status, message, extra }) => (<Result
    status={status || "404"}
    title={status || "404"}
    subTitle={message || ErrorInfo[status || "404"]}
    extra={extra || ''}
/>)

export default NoMatch