import { Button } from 'antd'
import { ColumnHead } from '../common'
import { DEPT_FORM, REMOVE_DEPT_TREE } from '../config/API'
import {
    statusOption, detailSpeHead, offerDetailHead,
    changeOrderHead, changeOrderPageRelations
} from './SpecdetailData'

export const flowActivityTransform = (response, pageName) => {
    const { data: { flowActivityInstance, flowActivityInstanceUser, flowActivityInstances, flowInstanceId, } } = JSON.parse(response)
    return ({
        head: detailSpeHead,
        data: flowActivityInstance,
        name: pageName,
        flowActivityInstances,
        flowActivityInstanceUser,
        statusOption,
        pageRelations: [],
        flowInstanceId
    })
}

export const flowInstanceTransform = (response, pageName) => {
    const { data } = JSON.parse(response)
    return ({
        head: [],
        data: [],
        name: pageName,
        flowActivityInstances: data,
        pageRelations: []
    })
}

export const editDataTransform = response => {
    const { data, head, model, name, url, pageButton, extraData, error, code } = JSON.parse(response)
    if (error || code === 500) {
        return ({ forms: [], pageButton: [], source: {} })
    }
    const noFilterForms = [{ head, data, model, name, url }].concat(extraData || [])
    const forms = noFilterForms.map(form => ({
        ...form,
        head: form.head.filter(headItem => headItem.position !== "0")
    }))
    return ({
        forms,
        pageButton,
        source: JSON.parse(response)
    })
}

export const saveEditDataTransform = data => {
    const saveData = {}
    return saveData
}

export const getDetailTransformCofing = ({ pageName }) => {
    switch (pageName) {
        case "flowInstanceView":
            return ({ transformResponse: response => flowInstanceTransform(response, pageName) })
        case "flowActivityInstanceUserTodoView":
            return ({ transformResponse: response => flowActivityTransform(response, pageName) })
        default:
            return ({})
    }
}

export const TransformToTreeTable = response => {
    const { data, head } = JSON.parse(response)
    const transformTreeData = (data, fatherId) => data.map(item => ({
        name: item.label,
        id: item.value,
        fatherId,
        pageButton: [
            {
                component: null,
                jsonValue: JSON.stringify({ fatherDept: "relateField_data.id" }),
                linkUrl: DEPT_FORM,
                name: "新增同级",
                popListLink: null,
                type: "pop_edit"
            },
            {
                component: null,
                jsonValue: JSON.stringify({ fatherDept: "relateField_data.id" }),
                linkUrl: DEPT_FORM,
                name: "新增子级",
                popListLink: null,
                type: "pop_edit"
            },
            {
                component: null,
                jsonValue: null,
                linkUrl: `${DEPT_FORM}/${item.value}`,
                name: "编辑",
                popListLink: null,
                type: "pop_edit"
            },
            {
                component: null,
                jsonValue: null,
                linkUrl: `${REMOVE_DEPT_TREE}/${item.value}`,
                name: "删除",
                popListLink: null,
                type: "goto_delete"
            }
        ],
        children: item.children && transformTreeData(item.children, item.value)
    }))
    const newHead = head.filter(item => item.position !== "0").map(headItem => ({
        ...headItem,
        name: headItem.label,
        code: headItem.name,
        position: headItem.position === "1" ? "2" : (headItem.position === "2" ? "1" : headItem.position),
        render: (values, record) => <ColumnHead head={headItem} values={values} record={record} />
    })).sort((a, b) => a.position - b.position)
    return ({
        columns: newHead,
        dataSource: transformTreeData(data)
    })
}

export const TransformToPivotTable = response => {
    const levelName = { "1": "bigClass", "2": "middleClass", "3": "category" }
    const dataSource = JSON.parse(response)

    const formatDataSource = (dataSource, prev) => dataSource.map(item => ({
        ...item,
        ...prev,
        [levelName[item.level]]: item.level === "3" ? item.serial + '-' + item.name : item.name,
        child: item.child && formatDataSource(item.child, { ...prev, [levelName[item.level]]: item.name })
    }))
    const head = [
        { code: "bigClass", features: { autoRowSpan: true }, name: <>大类<Button type="link" size="small">新增</Button></>, type: "string" },
        { code: "middleClass", features: { autoRowSpan: true }, name: '中类', type: "string" },
        { code: "category", name: '品类', type: "string" }
    ]
    const concatData = dataSource => dataSource.reduce((prev, current) => {
        return prev.concat(current.child ? concatData(current.child) : current)
    }, [])

    const transformPivotData = concatData(formatDataSource(dataSource))

    return ({ columns: head, dataSource: transformPivotData })
}

export const TransformOfferDetail = response => {
    const { code, message } = JSON.parse(response)
    if (code === 9999) {
        return ({ head: offerDetailHead, data: { nodeList: [] }, code, message })
    }
    return ({ head: offerDetailHead, data: JSON.parse(response) })
}

export const TransformOfferTabel = response => {
    const { spaces, head, code } = JSON.parse(response)
    if (code === 9999) {
        return ({ columns: [], dataSource: [] })
    }
    const dataSource = []
    spaces.forEach(spaceItem => {
        delete spaceItem.head
        spaceItem.items.forEach(item => {
            delete item.head
            const isLastLevel = item.dataList.data.list.length > 0
            if (isLastLevel) {
                item.dataList.data.list.forEach(dataItem => {
                    delete dataItem.head
                    dataSource.push({ ...spaceItem, ...item, ...dataItem, subitem: item.name, name: dataItem.name, isSubitem: true })
                })
            } else {
                delete item.dataList
                dataSource.push({ ...spaceItem, ...item, subitem: item.name, name: '' })
            }
        })
    })

    const columns = head.filter(item => item.position !== "0").map(headItem => ({
        ...headItem, name: headItem.label, code: headItem.name, pageType: "offerDetail"
    }))

    return ({ columns, dataSource })
}

export const TransformChangeOrder = response => {
    const { data, code, message } = JSON.parse(response)
    const dataSource = []
    const pageButton = [
        {
            name: "提交审核", type: "pop_edit", link: "",
            linkField: null, jsonValue: "", component: null, linkUrl: ""
        },
        {
            name: "变更单特殊审批", type: "pop_edit", link: "",
            linkField: null, jsonValue: "", component: null, linkUrl: ""
        },
        {
            name: "中尾期变更", type: "pop_edit", link: "",
            linkField: null, jsonValue: "", component: null, linkUrl: ""
        },
        {
            name: "中尾期特殊变更", type: "pop_edit", link: "",
            linkField: null, jsonValue: "", component: null, linkUrl: ""
        }
    ]

    data.data.length > 0 && data.data.forEach(spaceItem => {
        if (spaceItem.itemSpaceList.length > 0) {
            spaceItem.itemSpaceList.forEach(item => {
                delete spaceItem.itemSpaceList
                const isLastLevel = item.serviceList.length > 0
                if (isLastLevel) {
                    item.serviceList.forEach(dataItem => {
                        delete item.serviceList
                        dataSource.push({ ...spaceItem, ...item, ...dataItem, subitem: item.name, name: dataItem.name, isSubitem: true })
                    })
                } else {
                    dataSource.push({ ...spaceItem, ...item, subitem: item.name, name: '' })
                }
            })
        } else {
            dataSource.push({ ...spaceItem })
        }
    })

    data.priceChangeList = dataSource
    return ({ head: changeOrderHead, data, changeOrderList: dataSource, pageButton, pageRelations: changeOrderPageRelations, code, message })
}

