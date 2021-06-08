import { Button, Popover } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { OFFER_DETAIL_ADD_SUBITEM, REMOVE_ITEM, REMOVE_PRODUCT_OR_SERVICE, PASTE_PRODUCTS_OR_SERVICES } from '../config/API'
import { ColumnButton, ColumnHead } from '../common'
import { priceSheetHead } from './SpecdetailData'
/**
 * detail页数据格式化的规则
 * @param {*} dataSource
 * @returns for detail data
 */
export const formatDetail = dataSource => {
    const heads = dataSource.filter(item => item.position !== "0")
    const headTypes = dataSource.filter(item => item.position === "1").map(item => ({ type: item.groupName }))
    return headTypes.map((item, index) => ({
        type: (item.type === "" || item.type === null) ? `详情${!!index ? ` - ${index + 1}` : ''}` : item.type,
        category: heads.filter(headItem => headItem.groupName === item.type)
    })
    )
}

export const formatChangeOrder = changeOrderData => {
    const columns = priceSheetHead.map(item => ({ ...item, name: item.label, code: item.name }))
    return ({ dataSource: changeOrderData, columns })
}

export const formatOfferTable = (tableData, nodeType, { onShowModel, onDelete }) => {
    const freeUpdate = ["1", "4"]
    const addNode = [{
        component: null,
        jsonValue: null,
        linkUrl: OFFER_DETAIL_ADD_SUBITEM[nodeType],
        name: "新增子项",
        popListLink: null,
        type: "pop_plist"
    }]
    const unshiftItems = [
        { name: "空间类型", lock: true, code: "spaceName", type: "spaceName", render: values => <>{values}</>, features: { autoRowSpan: true } },
        {
            title: <>操作 / 子项<ColumnButton pageButton={addNode} onShowModel={onShowModel} /></>, align: 'center', lock: true,
            children: [
                {
                    name: "操作", code: "subitemPageButton",
                    features: { autoRowSpan: (v1, v2, row1, row2) => row1.subitem === row2.subitem },
                    render: (values, record) => <ColumnButton pageButton={values} record={record} onDelete={onDelete} />
                },
                {
                    name: "子项", code: "subitem", type: "subitem",
                    features: { autoRowSpan: true },
                    render: values => <>{values}</>
                }
            ]
        }
    ]
    function pageButton (item, nodeType) {
        const buttons = []
        if (item.isSubitem) {
            buttons.push({ ...item, name: "删除", type: "goto_delete", linkUrl: `${REMOVE_PRODUCT_OR_SERVICE}` })
            buttons.push({ ...item, name: "复制", type: "goto_refresh", linkUrl: "/" })
        }
        freeUpdate.includes(nodeType) && buttons.push({ ...item, name: "免费升级", type: "goto_refresh" })
        return buttons
    }
    function subitemPageButton (item, nodeType) {
        const buttons = []
        buttons.push({ ...item, name: "删除", type: "goto_delete", linkUrl: `${REMOVE_ITEM}?itemId=${item.id}&nodeType=${nodeType}` })
        buttons.push({
            ...item, name: "复制", type: "goto_refresh",
            linkUrl: `${PASTE_PRODUCTS_OR_SERVICES}?itemId=${item.id}&nodeType=${nodeType}&designId${item.designId}`
        })
        return buttons
    }
    const { columns, dataSource } = tableData
    const newDataSource = dataSource.map(item => ({
        ...item,
        pageButton: pageButton(item, nodeType + ""),
        subitemPageButton: subitemPageButton(item, nodeType + "")
    }))
    const sourceColumns = columns.map(item => item.position === "1" ? ({
        name: '操作 / ' + item.label,
        align: 'center',
        lock: true,
        children: [
            {
                name: '操作', code: "pageButton",
                render (value, record) {
                    return <ColumnButton pageButton={value} record={record} onDelete={onDelete} />
                }
            },
            { ...item, render: (values, record, rowIndex) => <ColumnHead head={item} values={values} dataSource={dataSource[rowIndex]} pageType={item.pageType} record={record} onShowModel={onShowModel} /> }
        ],
    }) : ({
        ...item,
        render: (values, record, rowIndex) => <ColumnHead head={item} values={values} dataSource={dataSource[rowIndex]} pageType={item.pageType} record={record} onShowModel={onShowModel} />
    }))

    const newColumns = unshiftItems.concat(sourceColumns)

    return ({ dataSource: newDataSource, columns: newColumns })
}

/**
 * 把overview中table的数据处理为适合ali-react-table所需要的数据
 * @param {*} tableData 含有head和data
 * @returns { dataSource: "ali-react-table的dataSource数组", columns: "同上" }
 */
export const formatTable = (tableData, { onShowModel, onDelete, isInModel }) => {
    if (!(tableData.head && tableData.data)) {
        if (!tableData.head) {
            return ({ dataSource: [], columns: [], pagination: { current: '1', pageSize: '20', total: 0 } })
        }
        if (!tableData.data) {
            return ({
                dataSource: [],
                columns: tableData.head.filter(item => item.position !== "0").map(item => ({
                    ...item,
                    name: item.label,
                    code: item.name
                })),
                pagination: { current: '1', pageSize: '20', total: 0 }
            })
        }
    }

    const { data: { current, pageSize, total, list }, head, listPageButton, name, url: service } = tableData
    let dataSource = list
    let footerData = []
    list.forEach((item, index, arr) => {
        if (Object.keys(item).length === 0) {
            dataSource = arr.slice(0, index)
            footerData = arr.slice(index + 1, arr.length)
        }
    })
    //head类型统一处理
    const columns = head.filter(item => item.position !== "0").map(item => {
        return ({
            ...item,
            name: item.label,
            code: item.name,
            features: { autoRowSpan: !!item.autoRowSpan },
            render: (values, record, rowIndex) => <ColumnHead head={item} values={values} dataSource={dataSource[rowIndex]} record={record} onShowModel={onShowModel} />
        })
    })
    //Button统一处理
    const specialListPageName = ["pageButton", "pageSetting", "doQuery"]
    const noOprationPageName = ["mainProductListForChangedPriceSheet_new"]
    const isHaveOpration = (listPageButton && listPageButton.length > 0) || specialListPageName.includes(name)
    if (isHaveOpration && !isInModel && !noOprationPageName.includes(name)) {
        columns.unshift({
            name: '操作', code: 'pageButton', lock: true,
            render (value, record) {
                return <ColumnButton pageButton={value} service={service} record={record}
                    onDelete={onDelete} onUndo={onDelete} onShowModel={onShowModel} />
            }
        })
    }
    return ({ dataSource, columns, footerData, pagination: { current, pageSize, total } })
}

export const formatPageConfig = ({ page, fields, pages, pageType }) => {
    const proptyName = pageType === "relations" ? "pageRelations" : "pageFieldPositions"
    const filterPage = page ? page[proptyName].filter(item => item.name !== "id" && item.position !== '0') : []
    const filterFields = fields.filter(item => item.type !== "id" && item.type !== "hide")
    return ({
        page: filterPage.map(item => ({ ...item, name: item.title || item.name })),
        fields: filterFields.map(item => ({ ...item, name: item.title || item.name })),
        pages
    })
}

export const formatTreeTable = ({ dataSource, columns }, { onShowModel }) => {
    const addColumnOperation = columnItem => {
        if (columnItem.position === "1") {
            return {
                ...columnItem,
                width: 240,
                render (values, record) {
                    return <>
                        <Popover
                            content={<ColumnButton pageButton={record.pageButton || []} onShowModel={onShowModel} record={record} />}
                            trigger='hover' placement="top">
                            <Button type="link" size="small"><MoreOutlined style={{ color: '' }} /></Button>
                        </Popover>
                        <ColumnHead head={values} values={values} record={record} />
                    </>
                }
            }
        }
        return columnItem
    }

    return ({
        dataSource: dataSource,
        columns: columns.map(item => addColumnOperation(item))
    })
}