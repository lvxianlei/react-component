import React, { useState } from "react"
import { Select, Radio, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import '../scss/CardForm.scss'
const Option = Select.Option
const CardType = {
    String: "文本类型", string: "文本类型", id: "隐藏", number: "数字类型", date: "时间类型",
    dateCopy: "时间类型", type: "下拉类型", text: "富文本类型", hide: "隐藏", select: "下拉类型",
    "java.math.BigDecimal": "数字类型", "java.util.Date": "时间类型", serial: "编号",
    areaLinkage: "文本类型", plist: "列表类型", markdown: "文本类型", ueditor: "富文本",
    tree: "树状类型", checkbox: "多选类型", picture: "图片"
}
const boxType = ["plist", "view"]
export default function CardForm ({ pages, pageType, data, onDelete }) {
    const { label, name, type, isLink, pageName, disabled } = data
    const [showInput, setShowInput] = useState(isLink === null || isLink === "0" || !isLink ? true : false)
    const isShowContent = boxType.includes(pageType)
    const handleRadioChange = event => {
        const showInput = event.target.value === "0"
        data.isLink = showInput
        setShowInput(showInput)
    }
    return (<Card
        size="small"
        className={!isShowContent && "target-card"}
        style={{ width: 360 }}
        title={<><span style={{ display: 'inline-block', width: '120px' }} >{label}</span><span>{name}</span></>}
        extra={<CloseOutlined className="delete" onClick={() => onDelete(data)} />}>

        {isShowContent && <div>
            <p>{CardType[type] || ""}</p>
            <div>
                <span>是否为超链接</span>
                <Radio.Group
                    disabled={disabled}
                    defaultValue={isLink === null || !isLink ? "0" : isLink}
                    onChange={handleRadioChange}>
                    <Radio value={"1"}>是</Radio
                    ><Radio value={"0"}>否</Radio>
                </Radio.Group>
            </div>
            <div className="card_link card_input" >
                <span>详情:</span>
                <Select
                    size="small"
                    style={{ width: '80%' }}
                    defaultValue={pageName}
                    disabled={showInput}
                >
                    {pages.map(item => <Option key={item.label} value={item.value}>{item.label}</Option>)}
                </Select>
            </div>
        </div>}
    </Card>)
}