// 此组件和SearchForm组件重复。只是样式不一样，若有时间可合并为一个组件
import { memo } from 'react'
import { Form, Row, Col, Button } from 'antd'
import FitFormItem from './FitFormItem'
import ColumnButton from './ColumnButton'
const { useForm } = Form
const noPageButton = ["pwd"]
const FitForm = memo(({ dataSource: { head, data, name }, onFinish, pageButton, loading }) => {
    const [form] = useForm()
    const cancelPwd = () => {
        form.resetFields()
        form.submit()
    }
    return (
        <Form
            className="fit-form"
            onFinish={onFinish}
            size="middle"
            form={form}
            layout="horizontal"
            initialValues={data}
        >
            <FitFormItem dataSource={head} />
            {
                noPageButton.includes(name) ? <Row>
                    <Col span={24} style={{ textAlign: 'left' }}>
                        <Button htmlType="submit" type="primary" loading={loading}>保存</Button>
                        <Button style={{ marginLeft: '14px' }} type="primary" onClick={cancelPwd}>取消</Button>
                    </Col>
                </Row> : <Row gutter={10}>
                    {pageButton && <ColumnButton pageButton={pageButton} />}
                </Row>
            }

        </Form>
    )
})

export default FitForm