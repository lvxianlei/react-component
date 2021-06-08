import { memo } from 'react'
import { Form, Row, Col, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import FitFormItem from './FitFormItem'
import { initFormValue } from '../util'
const { useForm } = Form

const SearchForm = memo(({ dataSource, onFinish }) => {
    const [form] = useForm()
    const searchDataSource = dataSource.map(item => ({ ...item, isSearch: true }))
    const onClear = () => {
        form.resetFields()
        form.submit()
    }

    return (
        <Form
            className="ant-advanced-search-form"
            onFinish={values => onFinish(values, searchDataSource)}
            size="small"
            form={form}
            layout="inline"
            labelAlign='right'
            initialValues={initFormValue(searchDataSource, {})}
            wrapperCol={{ span: 15 }}
        >
            <FitFormItem dataSource={searchDataSource} />
            {dataSource.length > 0 && <Row>
                <Col span={24} style={{ textAlign: 'left' }}>
                    <Button type="primary" htmlType="submit"><SearchOutlined />查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={onClear}>清除</Button>
                </Col>
            </Row>}
        </Form>
    )
})

export default SearchForm