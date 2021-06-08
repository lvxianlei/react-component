const commenData = {
    Operation: {                                                 //操作
        lt: "小于",
        le: "小于等于",
        gt: "大于",
        ge: "大于等于",
        ne: "不等于",
        eq: "等于",
        like: "包含"
    },
    OperationArray: [                                              //操作
        { value: "lt", name: "小于" },
        { value: "le", name: "小于等于" },
        { value: "gt", name: "大于" },
        { value: "ge", name: "大于等于" },
        { value: "ne", name: "不等于" },
        { value: "eq", name: "等于" },
        { value: "like", name: "包含" }
    ],
    TypeOperation: {                                                 //类型  操作对应关系
        string: [
            { value: "eq", name: "等于" },
            { value: "ne", name: "不等于" },
            { value: "like", name: "包含" }
        ],
        number: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        date: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" }
        ],
        dictionary: [{ value: "eq", name: "等于" }],
        choose: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        serial: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        picture: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" }
        ],
        checkbox: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        type: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        customized: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        plist: [
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ],
        tree: [
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
        ],
        text: [
            { value: "lt", name: "小于" },
            { value: "le", name: "小于等于" },
            { value: "gt", name: "大于" },
            { value: "ge", name: "大于等于" },
            { value: "ne", name: "不等于" },
            { value: "eq", name: "等于" },
            { value: "like", name: "包含" }
        ]
    },
    ValueType: {                                               //输入类型 与antd design校验规则一致(type)
        string: "string",
        id: "string",
        number: "number",
        //number:"string",
        date: "object",
        dateCopy: "object",
        text: "string",
        formList: "array",
        checkbox: "array",
        picture: "array",
        areaLinkage: "array",
        gatherPicture: "array",
        plist: "string"
    },
    ValueZH: {                                               //输入类型 与antd design校验规则一致(type)
        string: "字符串类型",
        id: "字符串类型",
        number: "数字类型",
        date: "字符串类型",
        dateCopy: "日期类型",
        text: "字符串类型",
        formList: "数组类型",
        checkbox: "数组类型",
        picture: "数组类型",
        areaLinkage: "数组类型",
        plist: "字符串类型"
    },
    Type: {                                                      //展示类型
        string: "string",
        id: "hidden",
        hidden: "hidden",
        number: "number",
        date: "date",
        dateCopy: "date",
        text: "textarea",
        select: "select",
        selection: "select",
        dictionary: "select",
        choose: "select",
        object: "select",
        type: "select",
        radio: "radio",
        checkbox: "checkbox",
        list: "string",
        plist: "plist",
        formList: "formList",
        picture: "picture",
        gather: "gather",
        gatherPicture: "gatherPicture",
        serial: "serial",
        relateButtonForCateGory: "relateButtonForCateGory",
        areaLinkage: "areaLinkage",
        markdown: "markdown",
        ueditor: "ueditor",
        tree: "tree",
        mapAddressCourt: "mapAddressCourt",
        exactAddress: "exactAddress"
    },
    Type_zh: {                                                   //展示类型--中文
        String: "文本类型",
        string: "文本类型",
        id: "隐藏",
        number: "数字类型",
        date: "时间类型",
        dateCopy: "时间类型",
        type: "下拉类型",
        text: "富文本类型",
        hide: "隐藏",
        select: "下拉类型",
        "java.math.BigDecimal": "数字类型",
        "java.util.Date": "时间类型",
        serial: "编号",
        areaLinkage: "文本类型",
        plist: "列表类型",
        markdown: "文本类型",
        ueditor: "富文本",
        tree: "树状类型",
        checkbox: "多选类型"
    }
}

export default commenData