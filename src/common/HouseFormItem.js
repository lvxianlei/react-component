import { useState } from 'react'
import { Form, InputNumber } from 'antd'
const { Item } = Form
export default function HouseFormItem ({ value = "0厅0室0厨0卫", onChange }) {
    const useValue = value || "0厅0室0厨0卫"

    const [values, setValues] = useState(useValue)
    const handleChange = (event, field) => {
        onChange(values.replace(new RegExp(`[0-9]${field}`), event + field))
        setValues(values.replace(new RegExp(`[0-9]${field}`), event + field))
    }
    const defaultValues = useValue.split(/[\u4E00-\u9FFF]/)
    return (<>
        <Item noStyle >
            <InputNumber
                style={{ width: '16%' }}
                onChange={event => handleChange(event, "厅")}
                defaultValue={defaultValues[0]}
                max={9} min={0} step={1} />
        </Item>
        <span style={{ padding: "4px 8px" }}>厅</span>
        <Item noStyle >
            <InputNumber
                style={{ width: '16%' }}
                onChange={event => handleChange(event, "室")}
                defaultValue={defaultValues[1]} max={9} min={0} step={1} />
        </Item>
        <span style={{ padding: "4px 8px" }}>室</span>
        <Item noStyle >
            <InputNumber
                style={{ width: '16%' }}
                onChange={event => handleChange(event, "厨")}
                defaultValue={defaultValues[2]} max={9} min={0} step={1} />
        </Item>
        <span style={{ padding: "4px 8px" }}>厨</span>
        <Item noStyle >
            <InputNumber
                style={{ width: '16%' }}
                onChange={event => handleChange(event, "卫")}
                defaultValue={defaultValues[3]} max={9} min={0} step={1} />
        </Item>
        <span style={{ padding: "4px 8px" }}>卫</span>
    </>)
}