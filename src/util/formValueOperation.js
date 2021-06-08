import moment from 'moment'
import BraftEditor from 'braft-editor'
export const initFormValue = (head, data, search) => {
    const initValue = { ...data }
    head.filter(item => item.position !== "0").forEach(item => {
        switch (item.type) {
            case "date":
                initValue[item.name] = initValue[item.name] ? moment(initValue[item.name]) : null
                break
            case "ueditor":
                initValue[item.name] = initValue[item.name] ? BraftEditor.createEditorState(initValue[item.name]) : null
                break
            case "plist":
                initValue[item.name] = {
                    [item.name]: initValue[item.name] || null,
                    [`${item.name}_label`]: initValue[`${item.name}_label`] || null
                }
                break
            default:
                break
        }
    })
    return initValue
}

export const submitFormFormatting = (data, head, search) => {
    const postValues = { ...data }
    head && head.filter(item => item.position !== "0").forEach(item => {
        switch (item.type) {
            case "date":
                if (item.isSearch) {
                    postValues[item.name] = postValues[item.name] ? postValues[item.name].map(item => item.valueOf()).join(",") : null
                } else {
                    postValues[item.name] = postValues[item.name] ? postValues[item.name].valueOf() + '' : null
                }
                break
            case 'plist':
                const name = postValues[item.name][item.name]||''
                const label = postValues[item.name][`${item.name}_label`]||''
                if (search) {
                    postValues[item.name] = name
                    delete postValues[`${item.name}_label`]
                } else {
                    postValues[item.name] = name
                    postValues[`${item.name}_label`] = label
                }
                break
            default:
                postValues[item.name] = postValues[item.name] || null
        }
    })
    return postValues
}
