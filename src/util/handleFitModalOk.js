import { post } from "../config/request"
import { SAVE_OR_UPDATE_URL } from "../config/API"
import { submitFormFormatting } from "../util"

const getModelURI = (type, popListLink, linkUrl, relation, form) => {
    if (type === "pop_edit") {
        if (form.postURL) {
            return form.postURL
        }
        const [services, name] = form.name.split("_")
        return `/${services}${SAVE_OR_UPDATE_URL}/${name}`
    }
    if (type === "pop_singlePlist") {
        if(popListLink){
            return popListLink
        }
        return `/${relation.url}/base/relateUpdate`
    }
    if (type === "pop_plist") {
        return `/${relation.url}/base/relateUpdate`
    }
    return linkUrl
}

const getModelParms = (type, checkBoxs, record, recordId, relation, detailId, form,popListLink) => {
    if (type === "pop_edit") {
        const formData = form.getFieldsValue()
        if (form.postURL) {
            return ({
                ...formData,
                designId: detailId,
            })
        }
        const { head, data } = form.source
        const postData = submitFormFormatting({ ...data, ...formData }, head)
        return ({ ...form.source, head, data: { ...postData } })
    }

    if (type === "goto_batch") {
        return ({ selectData: record, idList: checkBoxs.map(item => item.id) })
    }

    if (type === "pop_plist") {
        return ({
            field: relation.field,
            model: relation.model,
            id: relation.params.detailId,
            idList: checkBoxs.map(item => item.id),
            dataList: checkBoxs,
            relatePageName: relation.relatePageName
        })
    }
    if (type === "pop_singlePlist") {
        if(popListLink){
            return ({ selectData: record, id: recordId })
        }
        return({
            field: relation.field,
            model: relation.model,
            id: relation.params.detailId,
            idList: [record.id],
            dataList: record,
            relatePageName: relation.relatePageName
        })
    }
}

const modelCommonOk = async props => {
    const { type, linkUrl, form, checkBoxs, popListLink, record, relation, detailId, recordId, onSuccess } = props
    const path = getModelURI(type, popListLink, linkUrl, relation, form)
    const param = getModelParms(type, checkBoxs, record, recordId, relation, detailId, form)
    const fetchResult = await post(path, param)
    onSuccess && onSuccess(fetchResult, param.data)
}

export default modelCommonOk