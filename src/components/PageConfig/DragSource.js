import { Card } from 'antd'
import { useDrag } from 'react-dnd'

const style = { marginBottom: '10px' }

const DragSource = ({ type, data }) => {
    const [, drager] = useDrag({ type, item: data })
    return <div style={style} ref={drager}><Card size="small" type="inner" title={data.label}>{data.name}</Card></div>
}

export default DragSource