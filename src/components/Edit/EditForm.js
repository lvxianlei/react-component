// 此组件和SearchForm组件重复。只是样式不一样，若有时间可合并为一个组件
import { forwardRef, createRef, useState } from 'react'
import { Form, Row, Col, Button, Steps, Tabs, Result, message } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import { FitFormItem, ColumnButton } from '../../common'
import { initFormValue } from '../../util'
import '../../scss/Edit.scss'

const { useForm } = Form
const { Step } = Steps
const StepForm = forwardRef(({ dataSource, onFinish, onChange, onEditChange, name,source }, ref) => {
    const { head, data } = dataSource
    const [form] = useForm()
    const initvalues = initFormValue(head, data)
    return (
        <Form
            className="fit-form"
            onFinish={onFinish}
            size="middle"
            name={name}
            ref={ref}
            form={form}
            layout="horizontal"
            initialValues={initvalues}
            onValuesChange={(data, record) => {
                const specName = ["mapAddressCourt", "exactAddress"]
                if (specName.includes(Object.keys(data)[0])) {
                    form.setFieldsValue({ ...record, address: `${record.mapAddressCourt}${record.exactAddress}` })
                }
                onChange && onChange(record, form)
                onEditChange && onEditChange(record, dataSource, form,source)
            }}
        >
            <Row wrap className="form-row">
                <FitFormItem dataSource={head} />
            </Row>
        </Form>
    )
})

const StepsForm = (props) => <StepForm {...props} ref={props.selefRef} />

export default function EditForm ({ forms,source, onFinished, onFormChange, onStepChange, onEditChange, pageButton, isSuccess }) {
    const initData = {}
    forms.forEach(item => initData[item.name] = ({ ...item.data }))
    const [current, setCurrent] = useState(0)
    const [formData, setFormData] = useState(initData)

    const refs = forms.map(item => ({ ...item, ref: createRef() }))
    const handleNextClick = async form => {
        try {
            const values = await form.validateFields()
            form.submit(values)
            if (current < forms.length - 1) {
                setCurrent(current + 1)
            }
            if (current === forms.length - 1) {
                const parameter = { ...formData, [form.__INTERNAL__.name]: values }
                const isBreak = await onFinished({ parameter, form })
                isBreak && setCurrent(current + 1)

            }
        } catch (error) {
            message.warning("您此次填写还有不符合规则的选项，请仔细检查")
        }
    }

    const handlePrevClick = form => (current > 0) && setCurrent(current - 1)

    const handleFinish = (name, { values }) => setFormData({ ...formData, [name]: values })

    const renderTabBar = () => {
        if (forms.length > 1) {
            const steps = forms.map((form, index) => ({ title: "Step" + (index + 1), itemKey: form.model + form.name }))
            return (<Row>
                <Col span={20} push={2}>
                    <Steps current={current} size="small">
                        {steps.map(item => (<Step key={item.itemKey} title={item.title} />))}
                        <Step title="success" icon={<SmileOutlined />} />
                    </Steps>
                </Col>
            </Row>)
        }
    }

    if (refs.length === 1) {
        return <>
            <StepsForm dataSource={refs[0]} name={refs[0].name}
                onEditChange={onEditChange}
                onChange={onStepChange && onStepChange}
                selefRef={refs[0].ref} />
            <ColumnButton
                pageButton={pageButton}
                isSuccess={isSuccess} flag={true}
                onFinished={onFinished}
                parameter={{ formData, ref: refs[0].ref }} />
        </>
    }

    const activeKey = current === refs.length ? "last" : forms[current].model + forms[current].name

    return (<Form.Provider
        onFormFinish={handleFinish}
        onFormChange={onFormChange && onFormChange}>
        <Tabs
            className="edit-tabs"
            activeKey={activeKey}
            renderTabBar={renderTabBar}
        >
            {refs.map(form => (
                <Tabs.TabPane key={form.model + form.name} className='edit-tab-pane'>
                    <StepsForm dataSource={form} selefRef={form.ref} name={form.name} />
                    {refs.length > 1 && <Button type="primary" loading={isSuccess} style={{ marginRight: '14px' }}
                        onClick={() => handleNextClick(form.ref.current)}>{current === refs.length - 1 ? "保存" : "下一步"}</Button>}
                    {current > 0 && <Button type="primary" disabled={isSuccess} style={{ marginRight: '14px' }}
                        onClick={() => handlePrevClick(form.ref.current)}>上一步</Button>}
                </Tabs.TabPane>
            ))}
            <Tabs.TabPane key="last">
                <Result
                    status="success"
                    title="保存成功"
                    extra={<ColumnButton pageButton={pageButton} forms={forms} parameter={formData} source={source}
                        isSuccess={isSuccess}
                        onFinished={onFinished} />} />
            </Tabs.TabPane>
        </Tabs></Form.Provider>)
}
