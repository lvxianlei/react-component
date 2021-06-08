import { memo, useState } from 'react'
import { Spin, message } from 'antd'
import { NoMatch } from '../../common'
import { createSevices } from '../../hooks'
import { BaseTable, features, useTablePipeline } from 'ali-react-table'
import { useRequest } from 'ahooks'
import { formatOfferTable, TransformOfferTabel as transformResponse, modelCommonOk } from '../../util'
import FitModel from '../FitModel'
import '../../scss/Otable.scss'

const OfferDetailTabel = memo(({ request: { path, params }, nodeType }) => {
    const [visible, setVisible] = useState(false)
    const [eventInfo, setEventInfo] = useState({})
    const [tableDataSource, setTableDataSorce] = useState("")
    //扩展配置BaseTable
    const pipeline = useTablePipeline({ primaryKey: 'id' })
    const { data, loading, error } = useRequest(createSevices(path, params, { transformResponse }), {
        refreshDeps: [path]
    })

    const handleCancel = () => setVisible(false)

    const onShowModel = record => {
        setVisible(true)
        setEventInfo(record)
    }

    const handleDelete = record => {
        console.log("handleDelete:", record)
    }

    if (loading) { return <Spin loading={`${loading}`} /> }

    if (error) { return <NoMatch status="500" /> }

    const { dataSource, columns } = formatOfferTable(data, nodeType, {
        onShowModel,
        onDelete: handleDelete
    })

    pipeline.input({ dataSource: tableDataSource || dataSource, columns })

    pipeline.use(features.autoRowSpan())

    const handleFitModelOk = ({ result, record }) => {
        if (result.code === 200) {
            message.success(result.message)
            const tableDataSource = pipeline.getDataSource()
            const newTableDataSource = tableDataSource.filter(item => item.id !== record.id)
            setTableDataSorce(newTableDataSource)
            setVisible(false)
        }
    }

    return (
        <>
            <FitModel
                visible={visible}
                {...eventInfo}
                handleOk={(event) => modelCommonOk({ ...event, callBack: handleFitModelOk })}
                handleCancel={handleCancel} />
            <BaseTable
                {...pipeline.getProps()}
                defaultColumnWidth={140}
                isLoading={loading}
                useVirtual={false}
            />
        </>
    )
})

export default OfferDetailTabel