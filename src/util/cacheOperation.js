import { COMMEN_EDIT_URL } from '../config/API'
import { formatSearch, formatJsonValue } from './index'

export const setItem = (data) => {
    for (let key in data) {
        localStorage.setItem(key, data[key])
    }
}

export const getItem = (key, format) => {
    let value = localStorage.getItem(key)
    value = (format && format instanceof Function && format(value)) || value
    return value
}

export const setSessionItem = (data) => {
    for (let key in data) {
        sessionStorage.setItem(key, data[key])
    }
}

export const getSessionItem = (key, format) => {
    let value = sessionStorage.getItem(key)
    value = (format && format instanceof Function && format(value)) || value
    return value
}

export const removeItem = (key) => localStorage.removeItem(key)

/**
 * 通过history的state获取Overview页中需要请求的URL
 * @param {*} state history中的state
 * @returns string类型的URL
 */
export const getOverviewURI = (state, param) => {
    const menuInfo = getSessionItem('menu')
    const { pageName, service, overviewKey, overviewId } = param
    if (state) {
        return state.url
    }
    if (service) {
        return `/${service}/base/plist/${pageName}?${overviewKey}=${overviewId}`
    }

    if (menuInfo) {
        return JSON.parse(menuInfo).url
    }
}

export const getEditURI = ({ fetchURI, jsonValue, location, editId, formName, service, record }) => {
    let editPath, editJsonValue
    if (fetchURI) {
        editPath = fetchURI
        editJsonValue = decodeURI(jsonValue || "")
    } else {
        editPath = `/${service}${COMMEN_EDIT_URL}/${formName}${editId === "undefined" ? "" : "/" + editId}`
        const searchJsonValue = location ? formatSearch(location.search).jsonValue : jsonValue
        editJsonValue = decodeURI(searchJsonValue || "")
    }
    return ({ editPath, editJsonValue: formatJsonValue(editJsonValue, record) })
}