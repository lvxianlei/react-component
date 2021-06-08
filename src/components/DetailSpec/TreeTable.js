import { useState } from 'react'
import { Spin } from 'antd'
import { BaseTable, useTablePipeline, features } from 'ali-react-table'
import { useParams } from 'react-router-dom'
import FitModel from '../FitModel'
import { NoMatch } from '../../common'
import { useRequest } from 'ahooks'
import { createSevices } from '../../hooks'
import { DEPT_01, TREE_NODE_DETAIL } from '../../config/API'
import { TransformToTreeTable as transformResponse, lineClick, getOverviewURI, mapTreeUrl, formatTreeTable, modelCommonOk } from '../../util'
import { post } from '../../config/request'
import '../../scss/TreeTable.scss'
const clickPath = {
    'dept01': DEPT_01,
    'treeNodePlist2': TREE_NODE_DETAIL
}

const TreeTable = ({ location }) => {
    const params = useParams()
    const [visible, setVisible] = useState(false)
    const [eventInfo, setEventInfo] = useState({})
    const [rowInfo, setRowInfo] = useState(null)
    const clickFetchPath = clickPath[params.pageName]
    const path = getOverviewURI(location.state, params)
    const { data, loading, error } = useRequest(createSevices(path, {}, { transformResponse }), { refreshDeps: [path] })
    const pipeline = useTablePipeline({ primaryKey: 'id' })
    const handleCancel = () => setVisible(false)

    const onShowModel = record => {
        setVisible(true)
        setEventInfo(record)
    }

    const handleFitModelOk = ({ result, record, allData }) => {
        console.log("handleFitModelOk:")
    }

    if (loading) { return <Spin loading={`${loading}`} /> }

    if (error) { return <NoMatch status="500" /> }

    pipeline.input(formatTreeTable(data, { onShowModel }))

    pipeline.use(features.treeMode({ clickArea: 'icon', stopClickEventPropagation: true }))

    pipeline.use(mapTreeUrl({ rowInfo }))

    pipeline.use(lineClick({
        onClick: async rowkey => {
            const dataItems = await post(`${clickFetchPath}/${rowkey}`, "")
            delete dataItems.data.pageButton
            setRowInfo({ id: rowkey, data: dataItems.data, })
        }
    }))

    return <>
        <FitModel
            visible={visible}
            {...eventInfo}
            handleOk={(event) => modelCommonOk({ ...event, handleCancel, name: eventInfo.name, callBack: handleFitModelOk })}
            handleCancel={handleCancel} />
        <BaseTable {...pipeline.getProps()} />
    </>
}

export default TreeTable