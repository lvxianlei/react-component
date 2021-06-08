import { COMMEN_DETAIL_URL } from '../config/API'
import { formatSearch } from './searchOperation'

export {
    flowActivityTransform,
    flowInstanceTransform,
    getDetailTransformCofing,
    editDataTransform,
    saveEditDataTransform,
    TransformToTreeTable,
    TransformToPivotTable,
    TransformOfferDetail,
    TransformOfferTabel,
    TransformChangeOrder
} from './transformRules'
export { default as downloadFile } from './downloadFile'
export { default as formatJsonValue } from './formatJsonValue'
export { default as useInfo } from './useInfo'
export { CodeInfo, ErrorInfo } from './statusMsg'
export { lineClick, mapTreeUrl } from './customPipline'
export { initFormValue, submitFormFormatting } from './formValueOperation'
export { formatSearch, objToSearch } from './searchOperation'
export { default as modelCommonOk } from './handleFitModalOk'
export { default as cascaderOptions } from './cascaderOptions'
export { detailPriceHead, designHouseSpaceNames, designHouseSpaceFloors } from './SpecdetailData'
export { setItem, getItem, setSessionItem, getSessionItem, removeItem, getOverviewURI, getEditURI } from './cacheOperation'
export { formatTable, formatOfferTable, formatDetail, formatChangeOrder, formatPageConfig, formatTreeTable } from './formattingRules'

/**
 * 根据url来判断所要加载的组件
 * @param {*} path url路径
 */
export const chooseRouter = (path, pageName) => {
    const treeModePageNameList = ["dept01", "treeNodePlist2"]
    const pivotTablePageNameList = ["productCategoryManager"]
    const baseModeUrl = "/base/plist"
    const baseModePageNameList = ["pageSetting"]
    const userCenterList = ["myUserInfo", "pwd"]
    if (treeModePageNameList.includes(pageName)) {
        return `/treeTable/${pageName}`
    }
    if (pivotTablePageNameList.includes(pageName)) {
        return '/overview/pivotTable'
    }
    if (path.includes(baseModeUrl) || baseModePageNameList.includes(pageName)) {
        return "/overview/" + pageName
    }
    if (userCenterList.includes(pageName)) {
        return "/user/" + pageName
    }
    return '/detailspec/' + pageName
}

/**
 * 获取detail页中首个请求路径
 * @param {*} detailID Overview页中传过来的条目id 
 * @param {*} pageName Overview页中传过来的所要请求页的pageName 
 * @param {*} service Overview页中传过来的所要请求数据的微服务名称
 */
export const getDetailURI = ({ detailId, pageName, service }) => {
    switch (pageName) {
        case "flowActivityInstanceUserTodoView":
            return `/${service}/workflow/flowActivityView/${detailId}`
        case "flowInstanceView":
            return `/${service}/workflow/flowInstanceView/${detailId}`
        default:
            return `/${service}${COMMEN_DETAIL_URL}/${pageName}/${detailId}`
    }
}

export const getGoToPlistPath = ({ path, location, service }) => {
    const haveParam = path.includes("?")
    const firstSplit = path.split(haveParam ? "?" : "/")
    const formName = haveParam ? firstSplit[0].split("/") : firstSplit
    const param = haveParam && formatSearch(path)
    const isPageSetting = location.pathname === "/overview/pageSetting"
    const baseDetailPathname = `/detail/${service}/${formName[formName.length - 2]}/${formName[formName.length - 1]}`
    const designItemListPath = `/plist/${service}/${formName[formName.length - 1]}/designId/${param.designId}`
    const pageSettingPathname = `/pageSetting/${formName[formName.length - 1]}`
    const pathname = isPageSetting ? pageSettingPathname : haveParam ? designItemListPath : baseDetailPathname
    const basePlistPath = `/overview/${formName[formName.length - 1]}`
    if (location.pathname === "/overview/goodsProductPlist") {
        return `/${formName[formName.length - 2]}/${service}/${formName[formName.length - 1]}`
    }
    return path.includes("/base/plist") || path.includes("/find/plist") ? basePlistPath : pathname
}