import { useState } from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
const { Item } = Form
const { Option } = Select
export default function ExactAddress ({ value = "0//0//号", onChange }) {
    const useValue = value || "0//0//号"
    const [values, setValues] = useState(useValue)
    const handleChange = (event, field) => {
        const splitValue = values.split('/')
        splitValue[field] = event + ''
        const nextValue = splitValue.join('/')
        onChange(nextValue)
        setValues(nextValue)
    }
    const defaultValues = useValue.split('/')
    return (<Input.Group compact>
        <Item noStyle><InputNumber style={{ width: '16%' }} defaultValue={defaultValues[0]} onChange={event => handleChange(event, 0)} /></Item>
        <Item noStyle>
            <Select defaultValue={defaultValues[1]} onChange={event => handleChange(event, 1)} style={{ width: '22%', paddingRight: 0 }}>
                <Option value="" >无</Option>
                <Option value="号楼">号楼</Option>
                <Option value="栋">栋</Option>
                <Option value="座">座</Option>
                <Option value="幢">幢</Option>
            </Select>
        </Item>
        <Item noStyle><InputNumber style={{ width: '18%' }} defaultValue={defaultValues[2]} onChange={event => handleChange(event, 2)} /></Item>
        <Item noStyle>
            <Select defaultValue={defaultValues[3]} style={{ width: '22%', paddingRight: 0 }} onChange={event => handleChange(event, 3)}>
                <Option value="">无</Option>
                <Option value="单元">单元</Option>
                <Option value="门">门</Option>
            </Select>
        </Item>
        <Item noStyle><InputNumber style={{ width: '16%' }} defaultValue={defaultValues[4]} onChange={event => handleChange(event, 4)} /></Item>
        <span style={{ padding: "4px 0px 4px 8px" }}>号</span>
    </Input.Group>)
}