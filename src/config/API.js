/**
 * 配置文件
 */
const BASE_URI_FOR_ENV = {
    "development": "http://t.50-jia.com",
    "production": "https://s.50-jia.com",
    "local": "http://localhost"
}

const BASE_EXPORT_EXCEL_ENV = {
    "development": "http://t.50-jia.com:9000",
    "production": "http://s.50-jia.com:9000",
    "local": "http://localhost"
}

const isDEV = process.env.REACT_APP_ENV === "development"                      //是否开发环境

export const BASE_URL = BASE_URI_FOR_ENV[process.env.REACT_APP_ENV]                        //环境部署服务器域名

export const BASE_EXPORT_EXCEL = BASE_EXPORT_EXCEL_ENV[process.env.REACT_APP_ENV]                        //导出excel路径

export const Default_Search = "?loc=g01.p01.c01"

export const OSS_URL = "http://50jia-test.oss-cn-beijing.aliyuncs.com"   //阿里云oss

export const BLNHomeUrl = isDEV ? "http://phs.hyz792901324.com:8280/phs" : "http://bjbln.com/phs"  //博洛尼 系统首页URL

export const SSODomianPort = isDEV ? "http://phs.hyz792901324.com:8680" : "http://bjbln.com:8380"  //单点登录域名端口

//单点登录主页 
export const SSOLogininUrl = SSODomianPort + "/login/singlePointLogin.do?code=50-jia&redirectUrl=" + BASE_URL + "/api-user/50-jia/platformUserSinglePointLoginin.html"

//单点登录 登出URL
export const SSOLogoutUrl = SSODomianPort + "/login/singlePointLogout.do?code=50-jia&redirectUrl=" + BASE_URL + "/api-user/50-jia/platformUserSinglePointLoginin.html"

export const LOGIN_URL = BASE_URL + "/baserver/oauth/token"                             //登录

export const COMMEN_DETAIL_URL = "/base/find/view"    //detail页拼接部分  格式为`/${service}/base/find/view/${pageName}/${detailID}`

export const COMMEN_EDIT_URL = "/base/find/form"      //edit页拼接部分 格式为`/${service}${COMMEN_EDIT_URL}/${formName}/${editId}`

export const PAGE_SETTING_URL = "/baserver/page/listPage"  //pageSetting页基础Url

export const COMMEN_MYUSERINFO = "/baserver/base/find/view/myUserInfo" // 个人中心

export const SAVE_OR_UPDATE_URL = "/base/saveOrUpdate"      //保存 格式为`/${service}${COMMEN_EDIT_URL}/${formName}/${editId}`

export const SAVE_FIELD_URL = "/baserver/page/saveOrUpdatePage"              //保存表头url

export const MAIN_MENU_URL = "/baserver/menu/mainMenu"                       //获取菜单url

export const USER_INFO_URL = BASE_URL + "/baserver/get/userInfo"                        //用户信息

export const UPDATE_PASSWORD_URL = BASE_URL + "/baserver/update/pwd"                    // 修改用户密码

export const UPLOAD_PICTURE = "/baserver/page/uploadPicture"                  // ......

export const FLOW_INSTANCE_LOGS = "/customer/base/plist/flowInstanceLogs"

export const CHANGE_FLOW_STATUS = "/customer/workflow/changeFlowStatus"

export const FLOW_LIST = "/customer/base/plist/flowList"

export const TREE_NODE_DETAIL = "/customer/base/find/view/treeNodeDetail" //:id

export const DEPT_01 = "/baserver/base/find/view/dept01" //:ID

export const REMOVE_DEPT_TREE = "/baserver/deptTree/removeDeptTree" //:ID 部门管理 删除

export const DEPT_FORM = "/baserver/base/find/form/deptForm02" //部门管理 弹框编辑

export const SAVE_DOQUERY_UPDATE  = "/baserver/doquery/saveOrUpdate"

export const CALL_CENTER = "/call-center/clinkAccount/call"

export const LIST_QUERY_FIELDS = "/baserver/page/listQueryFields"

export const CREATE_DESIGN_HOUSE_SPACE = "/customer/design/createDesignHouseSpace"

export const GET_ACCOUNT_DETAIL = "/customer/getAccountDetail" //:id

export const REMOVE_ITEM = "/customer/project/removeItem"                                // 报价删除子项

export const REMOVE_PRODUCT_OR_SERVICE = "/customer/item/removeProductOrService"         // 报价删除子项

export const PASTE_PRODUCTS_OR_SERVICES = "/customer/item/pasteProductsOrServices"       // 报价复制子项

export const OFFER_DETAIL_ADD_SUBITEM = {
    "1": "/customer/base/plist/standardItemNormalList",
    "2": "/customer/base/plist/standardItemForHardNodeList",
    "3": "/customer/base/plist/standardItemForSoftNodeList",
    "4": "/customer/base/plist/standardItemForHardNodeList",
    "5": "/customer/base/plist/standardItemOutside",
    "6": "/customer/base/plist/standardItemForHardNodeList"
}                                                                           //  报价添加子项各节点URL