import { FLOW_INSTANCE_LOGS } from "../../config/API"
import OTable from '../Overview/OTable'
const ApprovalLog = ({ flowInstance }) => (
    <div className='process'>
        <p className='processTitle'>审批日志</p>
        <OTable request={{ path: FLOW_INSTANCE_LOGS, params: { "current": "1", "pageSize": "0", "params": { "flowInstance.id": flowInstance } } }} />
    </div>
)
export default ApprovalLog