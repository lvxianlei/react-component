import { Select, Form, Input, InputNumber, DatePicker, Cascader, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { cascaderOptions, getSessionItem } from '../util'
import HouseFormItem from './HouseFormItem'
import ExactAddress from './ExactAddress'
import MapAddressCourt from './MapAddressCourt'
import PlistFormItem from './PlistFormItem'
import { UPLOAD_PICTURE, BASE_URL } from '../config/API'
const { RangePicker } = DatePicker
const { Option } = Select;
const { TextArea } = Input
const FormItem = Form.Item
const commonStyle = { minWidth: '24%', marginBottom: '8px', marginRight: '14px' }
const readOnlyStyle = readOnly => readOnly ? ({ border: "none", color: "red", background: "none" }) : ({})
/**
 * 在form数据中所有的type
 */
const formatLabel = label => {
    const isLetter = /[a-z]/i
    const standard = isLetter.test(label) && label.lastIndexOf('(') > -1
    return standard ? label.substring(0, label.lastIndexOf('(')) : label
}
const formType = {
    type (data) {
        return (
            <FormItem style={commonStyle} name={data.name}
                label={formatLabel(data.label)}
                rules={[{ required: data.must === '1' }]}>
                <Select
                    placeholder="请选择"
                    disabled={data.readOnly === "1"}
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                >
                    {
                        data.option.map(item => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))
                    }
                </Select>
            </FormItem>
        )
    },
    object (data) {
        return (
            <FormItem style={commonStyle} name={data.name}
                label={formatLabel(data.label)}
                rules={[{ required: data.must === '1' }]}>
                <Select
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="children"
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    disabled={data.readOnly === "1"}
                >
                    {data && data.option.map(item => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))
                    }
                </Select>
            </FormItem>
        )
    },
    string (data) {
        const houseTypeNames = ["houseType", "houseTypeOfClue"]
        if (houseTypeNames.includes(data.name)) {
            return (<FormItem style={{ ...commonStyle, maxWidth: '60%' }} name={data.name} label={formatLabel(data.label)} rules={[{ required: data.must === '1' }]}>
                <HouseFormItem />
            </FormItem>)
        }
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)} rules={[{ required: data.must === '1' }]}>
            <Input disabled={data.readOnly === '1'} style={readOnlyStyle(data.readOnly === '1')} />
        </FormItem>
        )
    },
    plist (data) {
        return (<FormItem style={commonStyle} name={data.name}
            rules={[{ required: data.must === '1' }]}
            label={formatLabel(data.label)}>
            <PlistFormItem data={data} style={{ width: '100%' }} />
        </FormItem>)
    },
    number (data) {
        return (<FormItem style={commonStyle} rules={[{ required: data.must === '1' }]} name={data.name}
            label={formatLabel(data.label)}><InputNumber
                disabled={data.readOnly === "1"}
                min={1}
                style={{
                    ...readOnlyStyle(data.readOnly === '1'),
                    width: "100%"
                }}
            /></FormItem>)
    },
    date (data) {
        if (data.isSearch) {
            return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}><RangePicker showTime inputReadOnly /></FormItem>)
        }
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}><DatePicker /></FormItem>)
    },
    areaLinkage (data) {
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}><Cascader placeholder="请选择"
            options={cascaderOptions} /></FormItem>)
    },
    decorationGear (data) {
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}><Input style={readOnlyStyle(data.readOnly === '1')} /></FormItem>)
    },
    checkbox (data) {
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}>
            <Select
                mode="multiple"
                placeholder="请选择"
                disabled={data.readOnly === "1"}
                getPopupContainer={triggerNode => triggerNode.parentElement}
            >
                {
                    data.option.map(item => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))
                }
            </Select>
        </FormItem>)
    },
    picture (data) {
        //valuePropName="fileList"
        const props = {
            accept: '.jpg, .jpeg, .png',
            action: BASE_URL + UPLOAD_PICTURE,
            data: function (file) {
                return { bucket: "test", data: file.name }
            },
            onChange (info) {
                if (info.file.status === 'done') {
                    message.success(`${info.file.name}上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name}上传失败`);
                }
            }
        }
        const normFile = (e) => {
            if (Array.isArray(e)) {
                return e
            }
            return e && e.fileList[0].response;
        };
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)} getValueFromEvent={normFile}>
            <Upload {...props}
                headers={{ Authorization: `Bearer ${getSessionItem('access_token')}` }} >
                <Button type='ghost' icon={<UploadOutlined />}>上传</Button>
            </Upload>
        </FormItem>)
    },
    ueditor (data) {
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}>
            <BraftEditor placeholder="请输入正文内容" />
        </FormItem>)
    },
    text (data) {
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)}><TextArea disabled={data.readOnly === "1"} /></FormItem>)
    },
    mapAddressCourt (data) {
        return (<FormItem style={commonStyle} name={data.name}
            label={formatLabel(data.label)}>
            <MapAddressCourt data={data} />
        </FormItem>)
    },
    exactAddress (data) {
        return (<FormItem style={{ ...commonStyle, maxWidth: '60%' }} name={data.name} label={formatLabel(data.label)}><ExactAddress /></FormItem>)
    },
    customized (data) {
        return (<FormItem style={commonStyle} name={data.name} label={formatLabel(data.label)} rules={[{ required: data.must === '1' }]}>
            <Input disabled={data.readOnly === '1'} style={readOnlyStyle(data.readOnly === '1')} />
        </FormItem>)
    }
}

/**
 * 在form数据中根据type类型返回不同的展示组件
 * @param {*} formItemData  同columnsTypeHandlers的columns
 */
export default function FitFormItem ({ dataSource }) {
    return (<>
        {dataSource && dataSource.map(formItem => {
            const itemKey = formItem.id ? formItem.id + formItem.name : formItem.name + formItem.position
            if (formType[formItem.type]) {
                return <div style={{ minWidth: '24%' }} key={itemKey}>{formType[formItem.type](formItem)}</div>
            }
            return (
                <FormItem
                    style={commonStyle}
                    name={formItem.name}
                    key={formItem.id + formItem.name}
                    label={formItem.label.split("(")[0]}>
                    <Input />
                </FormItem>)
        })}
    </>)
}

