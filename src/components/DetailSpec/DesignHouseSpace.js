import { Form, Space, InputNumber, Button, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { designHouseSpaceNames, designHouseSpaceFloors } from '../../util'
import { CREATE_DESIGN_HOUSE_SPACE } from '../../config/API'
const { Option } = Select
export default function DesignHouseSpace ({ form }) {
    form.postURL = CREATE_DESIGN_HOUSE_SPACE
    return <Form
        name="designHouseSpace"
        form={form}
    >
        <Form.List name="data">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                label="名&nbsp;&nbsp;&nbsp;&nbsp;称"
                                fieldKey={[fieldKey, 'name']}
                                rules={[{ required: true, message: '必须填写名称！！！' }]}
                            >
                                <Select showSearch optionFilterProp="children" style={{ width: "174px" }} placeholder="请选择">{
                                    designHouseSpaceNames.map(item => (
                                        <Option value={item.name} key={item.label}>{item.label}</Option>
                                    ))
                                }</Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'area']}
                                label="面积（平米）"
                                fieldKey={[fieldKey, 'last']}
                            >
                                <InputNumber style={{ width: "174px" }} min={1}/>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'last']}
                                label="楼&nbsp;&nbsp;&nbsp;&nbsp;层"
                                fieldKey={[fieldKey, 'spaceType']}
                            >
                                <Select style={{ width: "174px" }} placeholder="请选择">{
                                    designHouseSpaceFloors.map(item => (
                                        <Option value={item.name} key={item.label}>{item.label}</Option>
                                    ))
                                }</Select>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add({ id: "", name: null, spaceType: null, floor: "1" })}
                            block
                            icon={<PlusOutlined />}>添加空间</Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    </Form>
}