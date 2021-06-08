import { useState } from 'react'
import { Spin, Tabs, Descriptions } from 'antd'
import { useParams } from 'react-router-dom'
import { BaseTable, features, useTablePipeline } from 'ali-react-table'
import OTable from "../Overview/OTable"
import { ColumnHead, ColumnButton, NoMatch } from '../../common'
import { FLOW_LIST } from "../../config/API"
import { createSevices } from '../../hooks'
import { useRequest } from 'ahooks'
import { TransformChangeOrder as transformResponse, formatChangeOrder, formatDetail } from '../../util'
const { TabPane } = Tabs
export default function ChangeOrder () {
    const { service, pageName, priceSheetId } = useParams()
    const fetchPath = `/${service}/${pageName}/gotoChangeView/${priceSheetId}`
    const pipeline = useTablePipeline({ primaryKey: 'id' })
    const [tableDataSource] = useState("")
    const { data, loading, error } = useRequest(createSevices(fetchPath, {}, { transformResponse }))

    if (loading) { return <Spin loading={`${loading}`} /> }

    if (error) { return <NoMatch status="500" /> }
    const { dataSource, columns } = formatChangeOrder(data.changeOrderList || [])

    pipeline.input({ dataSource: tableDataSource || dataSource, columns })

    pipeline.use(features.autoRowSpan())

    return <>
        <div className="top-btns">
            <ColumnButton pageButton={data.pageButton || []} />
        </div>
        { formatDetail(data.head).map(head => (<Descriptions
            className="descriptions"
            size="small"
            title={head.type}
            column={{ xs: 1, sm: 2, md: 3 }}
            key={head.type}>
            {head.category.map(item => (<Descriptions.Item key={item.name} label={item.label}>
                <ColumnHead head={item} values={data.data[item.name]} record={data.data} />
            </Descriptions.Item>))}
        </Descriptions>))}
        <p>详细信息</p>
        <BaseTable
            {...pipeline.getProps()}
            defaultColumnWidth={140}
            isLoading={loading}
            useVirtual={false}
        />
        <Tabs tabPosition="top">
            {
                data.pageRelations && data.pageRelations.map((relation, index) => (
                    <TabPane tab={relation.title} key={index}>
                        <OTable pageButton={relation.pageButton || []} record={data.data} pageRelations={relation} request={{
                            path: relation.plistUrl,
                            params: relation.noParams ? { [relation.fieldSource]: data.data[relation.field] } :
                                { current: "1", pageSize: "20", params: { [relation.fieldSource]: priceSheetId } }
                        }} />
                    </TabPane>
                ))
            }
            <TabPane tab="流程">
                <OTable request={{
                    path: FLOW_LIST, params: { current: "1", pageSize: "20", params: { "modelId": priceSheetId } }
                }} />
            </TabPane>
        </Tabs>
    </>
}