import { Form, Row } from 'antd'
import FitFormItem from './FitFormItem'
import { initFormValue } from '../util'
export default function FitModelForm ({ dataSource, form, formName }) {
    form.name = formName
    form.source = { ...dataSource }
    return (
        <Form
            name={formName}
            className="fit-form"
            size="middle"
            form={form}
            layout="horizontal"
            initialValues={initFormValue(dataSource.head, dataSource.data)}
        >
            <Row wrap className="form-row"><FitFormItem dataSource={dataSource.head.filter(item => item.position !== "0")} /></Row>
        </Form>
    )
}