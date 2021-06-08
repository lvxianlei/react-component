import { useState } from 'react'
import { Form, Input } from 'antd'
import { FitModel } from '../components'
import { CloseCircleFilled } from '@ant-design/icons'
const { Item } = Form
export default function PlistFormItem ({ value, onChange, data }) {
    const [values, setValues] = useState(value)
    const [visible, setVisible] = useState(false)
    const [eventInfo, setEventInfo] = useState({})
    const handleInputClick = () => {
        setEventInfo({ ...data, name: data.label, linkUrl: data.plistUrl })
        setVisible(true)
    }
    const handleOk = ({ record }) => {
        setValues({
            [data.name]: record.id,
            [`${data.name}_label`]: data.value ? record[data.value] : record.name
        })
        setVisible(false)
        onChange({
            [data.name]: record.id,
            [`${data.name}_label`]: data.value ? record[data.value] : record.name
        })
    }
    return (<>
        <FitModel visible={visible} {...eventInfo} handleOk={handleOk} handleCancel={() => setVisible(false)} />
        <Item>
            <Input
                suffix={<CloseCircleFilled style={{ color: 'rgba(0, 0, 0, .25)' }} onClick={() => setValues({ [data.name]: null, [`${data.name}_label`]: null })} />}
                value={values[`${data.name}_label`]} onClick={handleInputClick} readOnly />
        </Item>
    </>)
}