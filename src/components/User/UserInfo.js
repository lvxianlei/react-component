import { Descriptions, Tabs, Spin } from 'antd'
import { ColumnHead, ColumnButton } from '../../common/index'
import { FLOW_LIST, COMMEN_MYUSERINFO } from "../../config/API"
import { createSevices } from "../../hooks"
import { useRequest } from 'ahooks'
import { NoMatch } from '../../common/index'
import OTable from '../Overview/OTable'
import { formatDetail } from "../../util"
const { TabPane } = Tabs

const UserInfo = () => {
    const requestService = createSevices(COMMEN_MYUSERINFO, {}, {})
    const { data: dataSource, loading: userInfoLoading, error: userInfoError } = useRequest(requestService)
    if (userInfoLoading) {
        return <Spin loading={`${userInfoLoading}`} />
    }

    if (userInfoError) {
        return <NoMatch status="500" />
    }
    return (<>
        <div className="top-btns">
            <ColumnButton
                pageButton={dataSource.pageButton || []}
                service={dataSource.url}
                pageName={dataSource.name}
            />
        </div>
        {formatDetail(dataSource.head).map(head => (<Descriptions
            className="descriptions"
            size="small"
            title={head.type}
            column={{ xs: 1, sm: 2, md: 4 }}
            key={head.type}>
            {head.category.map(item => (<Descriptions.Item key={item.name} label={item.label}>
                <ColumnHead head={item} values={dataSource.data[item.name]} record={dataSource.data} />
            </Descriptions.Item>))}
        </Descriptions>))}
        <Tabs tabPosition="top">
            <TabPane tab="流程">
                <OTable request={{
                    path: FLOW_LIST, params: { current: "1", pageSize: "20", params: { "modelId": dataSource.data.id } }
                }} />
            </TabPane>
        </Tabs>
    </>)
}


export default UserInfo