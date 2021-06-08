/**
 * 格式化URL中search
 * @param {*} search 
 * @returns { key: value }
 */
export const formatSearch = (search) => {
    const searchObj = {}
    const keyValueArr = search.split("?")[1] && search.split("?")[1].split("&")
    keyValueArr.forEach(keyValue => {
        const keys = keyValue.split("=")
        searchObj[keys[0]] = keys[1]
    })
    return searchObj
}

/**
 * {a:'b'} 处理成serach格式
 * @param {*} obj {a:'b'}
 * @returns 'key=value&key2=value2'  ps: 不含 '?'
 */
export const objToSearch = obj => {
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
        throw new Error(`objToSearch参数必须为object`)
    }
    return Object.key(obj).map(key => `${key}=${obj[key]}`).join("&")
}