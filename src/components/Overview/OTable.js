import { memo, useState, useEffect } from 'react'
import { Spin, Checkbox, Pagination, message } from 'antd'
import { NoMatch, ColumnButton } from '../../common'
import { createSevices } from '../../hooks'
import { BaseTable, useTablePipeline, features } from 'ali-react-table'
import { useRequest } from 'ahooks'
import { formatTable, lineClick, modelCommonOk } from '../../util'
import FitModel from '../FitModel'
import { post } from '../../config/request'
import '../../scss/Otable.scss'
import { useParams, useHistory } from 'react-router-dom'
let postParam
const OTable = memo(({ request: { path, params }, type, onLoaded, isInModel, record, onSelect, relation, pageButton = [] }) => {
    const history = useHistory()
    const { detailId } = useParams()
    const [visible, setVisible] = useState(false)
    const [eventInfo, setEventInfo] = useState({})
    const [select, setSelect] = useState([])
    const [depParams, setDepParams] = useState(params || { current: "1", pageSize: "20", params: {} })
    //扩展配置BaseTable
    const pipeline = useTablePipeline({ primaryKey: 'id' })
    const { data, loading, error, run } = useRequest(createSevices(path.substring(path.indexOf("/") + 1), depParams), {
        refreshDeps: [path.substring(path.indexOf("/") + 1), JSON.stringify(depParams)],
        onSuccess (result) {
            onLoaded && onLoaded(result)
        }
    })
    useEffect(() => {
        params && setDepParams({ ...params })
    }, [params])

    const handleCancel = () => setVisible(false)

    const onShowModel = record => {
        setVisible(true)
        setEventInfo(record)
    }

    const onSelectChange = nextSelect => {
        setSelect(nextSelect.map(id => dataSource.find(item => item.id === id)))
        onSelect && onSelect(nextSelect.map(id => dataSource.find(item => item.id === id)))
    }

    const onChange = (current, size) => setDepParams({ ...depParams, current: current + '', pageSize: size + '' })

    const handleDelete = async ({ linkUrl, record: current, type, checkBoxs }) => {
        switch (type) {
            case 'goto_delete':
                postParam = ''
                break
            case 'goto_batch':
                postParam = { "idList": checkBoxs, "viewId": record && record.id ? record.id : "" }
                break
            case 'goto_refresh':
                postParam = current
                break
            default:
                return
        }

        const result = await post(linkUrl, postParam)
        if (result.code + "" === "200") {
            // if (type === 'goto_delete') {
            //     const tableDataSource = pipeline.getDataSource()
            //     const newTableDataSource = tableDataSource.filter(item => item.id !== current.id)
            //     setTableDataSorce(newTableDataSource)
            // } else {
            //     // run()
            history.go()

            message.success(result.message)
        } else if (result.code + "" === "9999") {
            message.success(result.message)
        }
    }

    if (loading) {
        return <Spin loading={`${loading}`} />
    }

    if (error) {
        return <NoMatch status="500" />
    }

    const { dataSource, columns, pagination: { total, current, pageSize } } = formatTable(data, {
        isInModel,
        onShowModel,
        onDelete: handleDelete
    })

    pipeline.input({ dataSource, columns })
    
    pipeline.use(features.autoRowSpan())

    if ((data.bottomPageButton && data.bottomPageButton.length > 0) || type === "pop_plist") {
        pipeline.ctx.components.Checkbox = Checkbox
        pipeline.use(features.multiSelect({
            highlightRowWhenSelected: true,
            checkboxPlacement: 'start',
            checkboxColumn: { lock: true },
            onChange: onSelectChange,
            clickArea: 'cell',
            stopClickEventPropagation: false
        }))
    }

    const handleFitModelOk = result => {
        if (result.code && result.code + "" !== "200"){
            message.error(result.message)
        }
        result.code + "" === "200" && message.success(result.message)
        setVisible(false)
        run()
    }
    //是否是在Model弹框内
    if (isInModel && type !== "pop_plist") {
        pipeline.use(lineClick({
            onClick (rowKey, record) {
                onSelect && onSelect({ rowKey, record })
            }
        }))
    }
    return (
        <>
            <FitModel
                visible={visible}
                {...eventInfo}
                checkBoxs={select}
                handleOk={event => modelCommonOk({
                    ...event,
                    name: eventInfo.name,
                    detailed: detailId,
                    onSuccess: handleFitModelOk
                })}
                handleCancel={handleCancel} />
            <div style={{ display: "flex" }}>
                <ColumnButton pageButton={pageButton} onShowModel={onShowModel} checkBoxs={select.map(item => item.id)} onRequestTips={handleDelete}
                    onUndo={handleDelete} record={record} relation={relation} />
            </div>
            <BaseTable
                style={{ overflow: 'auto', maxHeight: 800 }}
                {...pipeline.getProps()}
                defaultColumnWidth={160}
                isLoading={loading}
                useVirtual={false}
            />
            <ColumnButton pageButton={!isInModel && data.bottomPageButton} checkBoxs={select.map(item => item.id)} onUndo={handleDelete} onShowModel={onShowModel} />
            <Pagination
                style={{ marginTop: '16px' }}
                total={total}
                showSizeChanger
                showQuickJumper
                showTotal={total => `共${total}条`}
                current={current}
                defaultPageSize={pageSize}
                onChange={onChange}
            />
        </>
    )
})
export default OTable