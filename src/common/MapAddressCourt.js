import { useState } from 'react'
import { Row, Col, Input, Modal, Form } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { Map, Markers } from 'react-amap'
const { Item } = Form
export default function MapAddressCourt ({ value, onChange, data }) {
    const [values, setValues] = useState(value)
    const [markers, setMarkers] = useState([])
    const [center, setCenter] = useState({ longitude: 116.397499, latitude: 39.908722 })
    const [zoom, setZoom] = useState(12)
    const [visible, setVisible] = useState(false)
    const handleInputClick = () => setVisible(true)
    // const handleOk = ({ record }) => {
    //     setValues(data.value ? record[data.value] : record.name)
    //     setVisible(false)
    //     onChange(record.id)
    // }

    const initAMapUI = () => {
        window.AMapUI.loadUI(["misc/PoiPicker"], PoiPicker => {
            const poiPicker = new PoiPicker({
                input: 'tipinput' //输入框id
            })
            //监听poi选中信息
            poiPicker.on('poiPicked', ({ item, source }) => {
                setMarkers([{
                    position: {
                        longitude: item.location.lng || item.position.longitude,
                        latitude: item.location.lat || item.position.latitude
                    }
                }])
                setCenter({ longitude: item.location.lng, latitude: item.location.lat })
                setZoom(15)
                setValues(item.name)
            })
        })
    }

    const onResultChange = event => setValues(event.target.value)

    const handleChange = value => {
        onChange(values)
        setVisible(false)
    }

    return <>
        <Modal
            title={data.label}
            visible={visible}
            onOk={handleChange}
            onCancel={() => setVisible(false)}
            zIndex={10}
            width={950}
            destroyOnClose
        >
            <Row style={{ paddingBottom: '10px' }}>
                <Col span={4} style={{ textAlign: 'right', lineHeight: '27px' }}>小区名称：</Col>
                <Col span={8}>
                    <Input.Search id='tipinput' enterButton />
                </Col>
                <Col span={4} style={{ textAlign: 'right', lineHeight: '27px' }}>选定结果：</Col>
                <Col span={8}>
                    <Input.Search onChange={onResultChange} value={values} enterButton="确认" />
                </Col>
            </Row>
            <div style={{ width: '100%', height: 500, position: 'relative' }}>
                <Map
                    amapkey={'9b011dc902a08b0c036e728ab241ce13'}
                    useAMapUI={initAMapUI}
                    center={center}
                    zoom={zoom}
                    zoomEnable
                >
                    <Markers markers={markers} />
                </Map>
            </div>
        </Modal>
        <Item>
            <Input
                suffix={<CloseCircleFilled style={{ color: 'rgba(0, 0, 0, .25)' }} onClick={() => setValues(null)} />}
                value={values} onClick={handleInputClick} readOnly />
        </Item>
    </>
}