/**
 *detail页中"flowInstanceView"和"flowActivityInstanceUserTodoView"数据重组
 */
// 由于原系统数据规划不合理，强行修改后台会影响线上系统运行，
// 所以根据需要修改部分数据，若后期有其他方式的话再自行选择是否使用;
import { ColumnButton } from '../common'
export const statusOption = [
    { value: "1", label: "未处理" },
    { value: "2", label: "正在处理" },
    { value: "10", label: "搁置" },
    { value: "100", label: "已完成" },
    { value: "-1", label: "驳回" }
]

export const detailSpeHead = [
    { label: "任务名称", name: "title", groupName: "详情", type: "string", position: "1" },
    { label: "任务描述", name: "content", groupName: "详情", type: "string", position: "2" },
    { label: "任务状态", name: "status", groupName: "详情", type: "type", option: statusOption, position: "3" },
    { label: "相关内容", name: "flowInstance", groupName: "详情", type: "child", position: "4" },
    { label: "创建时间", name: "createDatetime", groupName: "详情", type: "date", format: "YYYY-MM-DD", position: "5" }
]

export const offerDetailHead = [
    { label: "客户姓名", name: "customerName", groupName: "客户信息", type: "string", position: "1" },
    { label: "房屋类型", name: "houseHouseModel", groupName: "客户信息", type: "string", position: "2" },
    { label: "房屋户型", name: "houseHouseType", groupName: "客户信息", type: "string", position: "3" },
    { label: "房屋新旧", name: "houseHouseAge", groupName: "客户信息", type: "string", position: "4" },
    { label: "房屋建筑面积(用于报价)(㎡)", name: "houseBuildingArea", groupName: "客户信息", type: "string", position: "5" },
    { label: "实测套内建筑面积(㎡)", name: "houseActualArea", groupName: "客户信息", type: "string", position: "6" },
    { label: "实测套内建筑面积(不含内墙)(㎡)", name: "insideActualArea", groupName: "客户信息", type: "string", position: "7" },
    { label: "硬装套包", name: "hardPackage", groupName: "客户信息", type: "string", position: "8" },
    { label: "方案风格", name: "style", groupName: "客户信息", type: "string", position: "9" },

    { label: "标配硬装总价(元)", name: "standardPrice", groupName: "费用信息", type: "string", position: "1" },
    { label: "老房拆除修复总价(元)", name: "changeFee", groupName: "费用信息", type: "string", position: "2" },
    { label: "硬装个性化施工价(元)", name: "personalServicePrice", groupName: "费用信息", type: "string", position: "3" },
    { label: "硬装个性化产品价(元)", name: "personalProductPrice", groupName: "费用信息", type: "string", position: "4" },
    { label: "税金(元)", name: "tax", groupName: "费用信息", type: "string", position: "5" },
    { label: "硬装总价(元)", name: "hardPrice", groupName: "费用信息", type: "string", position: "6" },
    { label: "软装价(元)", name: "softPrice", groupName: "费用信息", type: "string", position: "7" },
    { label: "全案价(元)", name: "totalPrice", groupName: "费用信息", type: "string", position: "8" },
    { label: "远程费(元)", name: "remoteFee", groupName: "费用信息", type: "string", position: "9" },
    { label: "周边产品总价(元)", name: "procurementProductPrice", groupName: "费用信息", type: "string", position: "10" },
    { label: "优惠费(元)", name: "discount", groupName: "费用信息", type: "string", position: "11" },
    { label: "合同总价(元)", name: "actualPayment", groupName: "费用信息", type: "string", position: "12" }
]

export const changeOrderHead = [
    { label: "名称", name: "name", groupName: "基本信息", type: "string", position: "1" },
    { label: "编号", name: "serial", groupName: "基本信息", type: "string", position: "2" },
    { label: "变更单金额(元)", name: "contractAmount", groupName: "基本信息", type: "string", position: "3" },
    { label: "所含税金(元)", name: "tax", groupName: "基本信息", type: "string", position: "4" },
    { label: "创建人", name: "creator", groupName: "基本信息", type: "string", position: "5" },
    { label: "创建日期", name: "createDate", groupName: "基本信息", type: "date", dateFormat: "YYYY-MM-DD HH:MM:SS", position: "6" }
]

export const changeOrderPageRelations = [
    {
        field: "designId",
        fieldSource: "designId",
        pageButton: [],
        noParams: true,
        plistUrl: "/customer/changedPriceTool/getChangedPriceSheetList",
        tips: null,
        title: "变更单列表",
        url: "customer"
    },
    {
        field: "priceSheetId",
        fieldSource: "changedPriceSheetId",
        pageButton: [{
            name: "上传变更单文件", type: "pop_edit", link: "/customer/base/find/form/designPicture01",
            linkField: null, jsonValue: "", component: null, linkUrl: ""
        }],
        plistUrl: "/customer/base/plist/changedPriceSheetFileList",
        tips: null,
        title: "变更单文件列表",
        url: "customer"
    },
    {
        field: "priceSheetId",
        fieldSource: "changedPriceSheetId",
        pageButton: [{
            name: "新建延期单", type: "pop_edit", link: "/customer/base/find/form/delayWorkForm",
            linkField: null, jsonValue: "", component: null, linkUrl: ""
        }],
        plistUrl: "/customer/base/plist/delayWorkSheets",
        tips: null,
        title: "延期单列表",
        url: "customer"
    },
    {
        field: "priceSheetId",
        fieldSource: "priceSheetId",
        pageButton: [],
        noParams: true,
        plistUrl: "/customer/changedPriceTool/getSaleOrderList",
        tips: null,
        title: "销售订单列表",
        url: "customer"
    }
]

export const priceSheetHead = [
    { label: "子项", name: "subitem", type: "string", position: "1" },
    { label: "空间", name: "houseSpaceName", type: "string", position: "2" },
    { label: "物料", name: "name", type: "string", position: "3" },
    { label: "销售价格", name: "unitPrice", type: "string", position: "4" },
    { label: "销售单位", name: "salesUnit", type: "string", position: "5" },
    { label: "原始数量", name: "originalAmount", type: "string", position: "6" },
    { label: "规格", name: "sizeType", type: "string", position: "7" },
    { label: "变更数量", name: "changingAmount", type: "string", position: "8" },
    { label: "变更后数量", name: "changedAmount", type: "string", position: "9" },
    { label: "变更类型", name: "type", option: [{ name: 'add', label: '增单' }, { name: "sup1", label: "设计返补" }, { name: "sup3", label: "索赔返补" }, { name: "sub", label: "退单" }], type: "string", position: "10" },
    { label: "备注", name: "memo", type: "string", position: "11" },
    { label: "组合名称", name: "groupName", type: "string", position: "12" },
    { label: "库存单位", name: "stockUnit", type: "string", position: "13" },
    { label: "原始工程数量", name: "originalProjectAmount", type: "string", position: "14" },
    { label: "变更工程数量", name: "changingProjectAmount", type: "string", position: "15" },
    { label: "变更后工程数量", name: "changedProjectAmount", type: "string", position: "16" },
    { label: "物料图片", name: "mainPictureUrl", type: "string", position: "17" },
    { label: "预测工程数量", name: "calculateProjectAmount", type: "string", position: "18" },
    { label: "特殊品类", name: "specialCategory", type: "string", position: "19" },
    { label: "品类", name: "categoryName", type: "string", position: "20" }
]

export const detailPriceHead = [
    { name: "操作", code: "pageButton", type: "string", position: "1", render: values => <ColumnButton pageButton={values} /> },
    { name: "名称", code: "name", type: "string", position: "2" },
    { name: "编号", code: "serial", type: "string", position: "3" },
    { name: "合同金额(元)", code: "contractAmount", type: "string", position: "4" },
    { name: "税率(%)", code: "taxRate", type: "string", position: "5" },
    { name: "所含税金(元)", code: "tax", type: "string", position: "6" },
    { name: "签署状态", code: "signedStatus", type: "string", position: "7" },
    { name: "创建日期", code: "createDate", type: "string", position: "8" },
    { name: "创建人", code: "personInCharge", type: "string", position: "9" }
]

export const designHouseSpaceNames = [
    { name: "SPT_LIVINGROOM", label: "客厅" }, { name: "SPT_DININGROOM", label: "餐厅" },
    { name: "SPT_FOYER", label: "门厅" }, { name: "SPT_BEDROOM", label: "主卧" },
    { name: "SPT_BEDROOM", label: "次卧1" }, { name: "SPT_BEDROOM", label: "次卧2" },
    { name: "SPT_KITCHEN", label: "厨房" }, { name: "SPT_TOILET", label: "卫生间" },
    { name: "SPT_HALLWAY", label: "走廊" }, { name: "SPT_STUDY", label: "书房" },
    { name: "SPT_CLOSET", label: "储物间" }, { name: "SPT_BEDROOM", label: "次卧3" },
    { name: "SPT_BEDROOM", label: "老人房" }, { name: "SPT_BEDROOM", label: "儿童房" },
    { name: "SPT_BEDROOM", label: "保姆间" }, { name: "SPT_TOILET", label: "次卫" },
    { name: "SPT_TOILET", label: "次卫2" }, { name: "SPT_TOILET", label: "次卫3" },
    { name: "SPT_COATROOM", label: "衣帽间" }, { name: "SPT_CLOAKROOM", label: "鞋帽间" },
    { name: "SPT_BALCONY", label: "客厅阳台" }, { name: "SPT_BALCONY", label: "阳台" },
    { name: "SPT_TERRACE", label: "阳台露台" }, { name: "SPT_HALLWAY", label: "B1层走廊" },
    { name: "SPT_HALLWAY", label: "二层走廊" }, { name: "SPT_HALLWAY", label: "三层走廊" },
    { name: "SPT_HALLWAY", label: "中厅" }, { name: "SPT_RECREATIONROOM", label: "茶室" },
    { name: "SPT_RECREATIONROOM", label: "影音室" }, { name: "SPT_RECREATIONROOM", label: "健身房" },
    { name: "SPT_LOFT", label: "阁楼" }, { name: "SPT_EQUIPMENTROOM", label: "设备间" },
    { name: "SPT_BASEMENT", label: "地下室" }, { name: "SPT_TOILET", label: "洗衣间" },
    { name: "SPT_TOILET", label: "保姆卫" }, { name: "SPT_FOYER", label: "玄关" },
    { name: "SPT_STAIRCASE", label: "楼梯间" }, { name: "SPT_BALCONY", label: "厨房阳台" },
    { name: "SPT_BALCONY", label: "主卧阳台" }, { name: "SPT_BALCONY", label: "次卧1阳台" },
    { name: "SPT_BALCONY", label: "次卧2阳台" }, { name: "SPT_BALCONY", label: "书房阳台" }
]

export const designHouseSpaceFloors = [
    { name: "B4", label: "B4层" }, { name: "B3", label: "B3层" }, { name: "B2", label: "B2层" },
    { name: "B1", label: "B1层" }, { name: "1", label: "1层" }, { name: "2", label: "2层" },
    { name: "3", label: "3层" }, { name: "4", label: "4层" }, { name: "5", label: "5层" }
]
