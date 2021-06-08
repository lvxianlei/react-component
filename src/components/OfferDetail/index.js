import { Spin, Descriptions, Tabs, Button } from 'antd'
import { useParams } from 'react-router-dom'
import { ColumnHead, NoMatch } from '../../common'
import OfferDetailTabel from './OfferDetailTabel'
import { useRequest } from 'ahooks'
import { createSevices } from '../../hooks'
import { TransformOfferDetail as transformResponse, formatDetail } from '../../util'
import { useHistory } from 'react-router-dom'

const { TabPane } = Tabs

export default function OfferDetail () {
    const history = useHistory()
    const { service, item, showType, offerId } = useParams()
    const path = `${service}/${item}/${showType}/${offerId}`
    const { data, loading, error } = useRequest(createSevices(path, "", { transformResponse }))

    if (loading) { return <Spin loading={`${loading}`} /> }

    if (error || data.code === 9999) {
        return <NoMatch status={data.code === 9999 ? "warning" : "500"} message={(data && data.message) || ""} extra={<Button
            type="primary"
            onClick={() => history.goBack()}>返回详情页</Button>} />
    }

    return (<>
        {formatDetail(data.head).map(head => (<Descriptions
            className="descriptions"
            size="small"
            title={head.type}
            column={{ xs: 1, sm: 2, md: 5 }}
            key={head.type}>
            {head.category.map(item => (<Descriptions.Item key={item.name} label={item.label}>
                <ColumnHead head={item} values={data.data[item.name]} record={data.data} />
            </Descriptions.Item>))}
        </Descriptions>))}
        <Tabs>
            {
                data.data.nodeList.map((nodeItem, index) => (
                    <TabPane tab={nodeItem.nodeName} key={index}>
                        <OfferDetailTabel
                            nodeType={nodeItem.nodeType}
                            request={{ path: nodeItem.address.URL, params: nodeItem.address.param }}
                        />
                    </TabPane>
                ))
            }
        </Tabs>
    </>)
}