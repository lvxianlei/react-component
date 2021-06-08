import { useState } from "react"
import { Spin, Descriptions, Tabs, Input, Row, Col, Button, Modal, Radio, message } from 'antd'
import { useParams } from 'react-router-dom'
import OTable from '../Overview/OTable'
import { ColumnButton, ColumnHead, NoMatch, FitTable } from '../../common'
import { useRequest } from 'ahooks'
import { createSevices } from '../../hooks'
import { formatDetail, getDetailURI, getDetailTransformCofing, detailPriceHead } from '../../util'
import { CHANGE_FLOW_STATUS, FLOW_LIST } from "../../config/API"
import { post } from "../../config/request"
import ApprovalLog from './ApprovalLog'
import '../../scss/Detail.scss'

const { confirm } = Modal
const { TabPane } = Tabs
const { TextArea } = Input
const DetailPage = () => {
    const { detailId } = useParams()
    const [news, setMessage] = useState('无')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [radio, setRadio] = useState('init')
    const [disabled, setDisabled] = useState(false)
    const fetchURL = getDetailURI(useParams())
    const requestService = createSevices(fetchURL, {}, getDetailTransformCofing(useParams()))
    const { data: detailData, loading: detailLoading, error: detailError, run } = useRequest(requestService, { refreshDeps: [fetchURL] })
  

    if (detailLoading) {
        return <Spin loading={`${detailLoading}`} />
    }
   
    if (detailError) {
        return <NoMatch status="500" />
    }

    if (!detailData.head) {
        return <><strong>Error : </strong>{`${detailData.message}...` || '数据错误...'}</>
    }

    const priceSheetFormatter = data => {
        return data && data.map(item => {
            const pageButton = Object.keys(item)
                .filter(keyItem => keyItem.includes("buttonName"))
                .map(buttonName => {
                    return ({
                        name: item[buttonName],
                        linkUrl: item[`button_link${buttonName[10] || ""}`],
                        type: "open_new"
                    })
                })
            return ({ ...item, pageButton })
        })
    }

    const handleClick = (status, ok = false) => {
        if (status === "0" && !ok) {
            setIsModalVisible(true)
        } else {
            const params = {
                message: news,
                id: detailData.flowActivityInstanceUser.id,
                status: status,
                radio: radio
            }
            if (news) {
                confirm({
                    content: `确认审核？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        setDisabled(true)
                        setIsModalVisible(false)
                        post(CHANGE_FLOW_STATUS, params)
                            .then((res) => {
                                if (res.code === 200) {
                                    message.success(res.message)
                                } else {
                                    message.error(res.message)
                                }
                            })
                    }
                })
            }
        }
    }

    const handleOk = () => handleClick("0", true)

    const state = detailData.flowActivityInstanceUser ? detailData.flowActivityInstanceUser.status : null

    let isShow = false
    if (state && state === '2') {
        isShow = true
    }
    const HandlerSimpleButton = async formData => {
        const result = await post(formData.linkUrl, formData.record === "" || formData.record === undefined ? "" : formData.record)
        if (result.code === 200) {
            const isLoad = await message.success(result.message)
            isLoad && run()
        }
    }
    return (<>
        <div className="top-btns">
            <ColumnButton
                pageButton={detailData.pageButton || []}
                service={detailData.url}
                pageName={detailData.name}
                onDelete={HandlerSimpleButton}
                onUndo={HandlerSimpleButton}
            />
        </div>
        {formatDetail(detailData.head).map(head => (<Descriptions
            className="descriptions"
            size="small"
            title={head.type}
            column={{ xs: 1, sm: 2, md: 3 }}
            key={head.type}>
            {head.category.map(item => (<Descriptions.Item key={item.name} label={item.label}>
                <ColumnHead head={item} values={detailData.data[item.name]} record={detailData.data} />
            </Descriptions.Item>))}
        </Descriptions>))}
        <Tabs tabPosition="top">
            {
                detailData.pageRelations && detailData.pageRelations.filter(item => item.title !== 'priceSheet').map((relation, index) => {
                    return (
                    <TabPane tab={relation.title} key={index}>
                        <OTable
                            pageButton={relation.pageButton || []}
                            record={detailData.data}
                            relation={{
                                ...relation,
                                params: {
                                    [relation.fieldSource]: detailData.data[relation.field] || detailData.data.id,
                                    detailId: detailData.data.id
                                }
                            }}
                            request={{
                                path: relation.plistUrl,
                                params: { current: "1", pageSize: "20", params: { [relation.fieldSource]:relation.title === "子菜单列表"? detailData.data.id : detailData.data[relation.field] || detailData.data.id } }
                            }} />
                    </TabPane>
                    )
                })
            }
            {
                detailData.pageRelations && detailData.pageRelations.find(item => item.title === 'priceSheet') && <TabPane tab="主报价单" key="priceSheet">
                    <FitTable
                        columns={detailPriceHead}
                        dataSource={priceSheetFormatter(detailData.pageRelations.find(item => item.title === 'priceSheet').dataList)}
                    />
                </TabPane>
            }

            {
                !['flowActivityInstanceUserTodoView', 'flowInstanceView', 'accountStatementDetail'].includes(detailData.name) &&
                <TabPane tab="流程">
                    <OTable request={{
                        path: FLOW_LIST, params: { current: "1", pageSize: "20", params: { "modelId": detailData.data.id } }
                    }} />
                </TabPane>
            }

        </Tabs>
        {
            detailData.flowActivityInstances && <div className='process'>
                <p className='processTitle'>审批进度</p>
                <div className="approvalSchedule">
                    {
                        detailData.flowActivityInstances.map((v, i) => {
                            return <div className="approvalBlock" key={i}>
                                <p className="approval" style={{
                                    background: ConfigStatusColor[v.status],
                                    color: v.status === "1" ? "#000" : "#fff"
                                }}>{ConfigStatus[v.status]}</p>
                                <p className="approvalTitle" key={i}>{v.title}</p>
                            </div>
                        })
                    }
                </div>
            </div>
        }
        {
            detailData.name === 'flowActivityInstanceUserTodoView' ?
                <ApprovalLog flowInstance={detailData.flowInstanceId} /> :
                (detailData.name === 'flowInstanceView' && <ApprovalLog flowInstance={detailId} />)
        }

        {
            detailData.flowActivityInstanceUser ? <div className='process'>
                <p className='processTitle'>审批意见</p>
                <TextArea placeholder='请填写审批意见' allowClear onChange={e => setMessage(e.target.value)} rows={6}
                    value={news}
                    readOnly={!isShow} />
            </div> : null
        }

        <Row style={{ "display": isShow ? "flex" : "none" }}>
            <Col span={2}><Button type="primary" disabled={disabled}
                onClick={() => handleClick("1")}>审核通过</Button></Col>
            <Col span={2}><Button type="primary" disabled={disabled}
                onClick={() => handleClick("0")}>审核不通过</Button></Col>
        </Row>

        <Modal
            title="驳回"
            style={{ top: 20 }}
            visible={isModalVisible}
            onOk={() => handleOk()}
            onCancel={() => setIsModalVisible(false)}
        >
            <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
                <Radio.Button value="init">驳回至初始节点</Radio.Button>
                <Radio.Button value="previous">驳回至上一节点</Radio.Button>
            </Radio.Group>
        </Modal>
    </>)
}


const ConfigStatus = {
    "1": "未处理",
    "2": "正在处理",
    "10": "搁置",
    "100": "已完成",
    "-1": "驳回"
}
// const ConfigStatus1 = {
//     "1": "审核通过",
//     "-1": "驳回",
//     "10": "反审核",
//     "5": "撤销"
// };
const ConfigStatusColor = {
    "1": "#ddd",
    "2": "#cc7040",
    "10": "搁置",
    "100": "#9fb461",
    "-1": "#ce5848"
}

const Detail = props => <DetailPage key={props.fetchURI || (props.location.pathname + props.location.search)} {...props} />

export default Detail