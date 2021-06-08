import { Spin, Form, Space, Button, Select, message, Row, Input } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { NoMatch } from '../common'
import { useParams } from 'react-router-dom'
import { createSevices } from '../hooks'
import { useRequest } from 'ahooks'
import { LIST_QUERY_FIELDS, SAVE_DOQUERY_UPDATE } from '../config/API'
import { post } from '../config/request'
import { default as commenData } from '../config/commenData'

const { Option } = Select
export default function SearchConfig () {
    const [form] = Form.useForm()
    const { configId, service } = useParams()
    const { data, loading, error } = useRequest(createSevices(`/${service}/doquery/find/${configId}`, {}, {}))
    const {
        data: configData,
        loading: configLoading,
        error: configError
    } = useRequest(() => post(`${LIST_QUERY_FIELDS}/${data.model}`, {}, {}), { ready: !!data })

    const onFinish = async values => {
        const postData = { ...data, ...values }
        const result = await post(SAVE_DOQUERY_UPDATE, postData)
        if (result.code === 200) {
            message.success(result.message)
        }
    }

    const handleFirstNameChange = (listName, key, option) => {
        form.setFieldsValue({ [listName]: form.getFieldValue([listName]).map((item, index) => index === key ? ({ ...item, type: option.title.type }) : item) })
    }

    if (loading || configLoading) { return <Spin loading={`${loading}`} /> }

    if (error || configError) { return <NoMatch status="500" /> }

    return <>
        <p>基本配置</p>
        <Form name="dynamic_form_nest_item"
            onFinish={onFinish}
            form={form}
            initialValues={data}
            autoComplete="off">
            <Row>
                <Form.Item name="name" label="查询组合名称"><Input /></Form.Item>
                <Form.Item name="type" label="查询类型">
                    <Select style={{ width: 150 }} >
                        <Select.Option value="DEFAULT">默认</Select.Option>
                        <Select.Option value="CONSTANT">固定</Select.Option>
                        <Select.Option value="INPUT">自定义</Select.Option>
                        <Select.Option value="OPEN_SEARCH">全文检索</Select.Option>
                    </Select>
                </Form.Item>
            </Row>
            <p>查询条件配置</p>
            <Form.List name='doQueryConditions'>
                {(fields, { add, remove }) => {
                    return (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => {
                                return (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, "name"]}
                                            fieldKey={[fieldKey, "name"]}
                                        >
                                            <Select style={{ width: 150 }}
                                                getPopupContainer={triggerNode => triggerNode.parentElement}
                                                onChange={(value, option) => handleFirstNameChange("doQueryConditions", key, option)} showSearch optionFilterProp="children">
                                                {
                                                    configData && configData.queryFieldList.map(item => <Option key={item.name} title={item} value={item.name}>{item.label}</Option>)
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'operation']}
                                            fieldKey={[fieldKey, 'operation']}
                                        >
                                            <Select
                                                style={{ width: 150 }}
                                                getPopupContainer={triggerNode => triggerNode.parentElement}
                                            >
                                                {
                                                    commenData.TypeOperation[form.getFieldValue(["doQueryConditions", key, "type"])].map(v => {
                                                        return (<Option key={v.value} value={v.value}>{v.name}</Option>)
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'type']}
                                            fieldKey={[fieldKey, 'type']}
                                        >
                                            <Select style={{ width: 150 }} disabled={true} getPopupContainer={triggerNode => triggerNode.parentElement}>
                                                {
                                                    Object.keys(commenData.Type_zh).map(v => {
                                                        return (<Option key={v} value={v}>{commenData.Type_zh[v]}</Option>)
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'value']}
                                            fieldKey={[fieldKey, 'value']}
                                        >
                                            <Select style={{ width: 150 }} disabled={true} getPopupContainer={triggerNode => triggerNode.parentElement}>

                                            </Select>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                )
                            })}
                            <Form.Item style={{ width: '50%' }}>
                                <Button type="dashed" onClick={() => add({
                                    name: '销售部门', operation: 'eq',
                                    type: 'plist', value: '默认值'
                                })} block icon={<PlusOutlined />}>添加查询项</Button>
                            </Form.Item>
                        </>
                    )
                }}
            </Form.List>
            <p>排序配置</p>
            <Form.List name='doQueryOrderBies'>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => {
                            return (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        fieldKey={[fieldKey, 'name']}
                                    >
                                        <Select style={{ width: 150 }} showSearch optionFilterProp="children" getPopupContainer={triggerNode => triggerNode.parentElement}>
                                            {
                                                configData && configData.orderFieldList.map(item => <Option key={item.name} value={item.name}>{item.label}</Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'direction']}
                                        fieldKey={[fieldKey, 'direction']}
                                    >
                                        <Select style={{ width: 150 }} getPopupContainer={triggerNode => triggerNode.parentElement}>
                                            <Option key="ASC" value="ASC">升序</Option>
                                            <Option key="DESC" value="DESC">降序</Option>
                                        </Select>
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            )
                        })}
                        <Form.Item style={{ width: '50%' }}>
                            <Button type="dashed" onClick={() => add({ name: 'id(id)', direction: 'ASC' })} block icon={<PlusOutlined />}>添加查询项</Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>
        </Form>
    </>
}