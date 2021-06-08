import { Image, Button, Popconfirm } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { downloadFile } from '../util'
const ImageView = ({ url }) => (
    <Image.PreviewGroup>
        {url instanceof Array ? url.map(item => {
            if (item.value.split('.')[item.value.split('.').length - 1] === "dwg") {
                return <Popconfirm
                    title="您是要下载此文件吗？"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => downloadFile(item.value)}
                    key={item.viewUrl}>
                    <Button
                        type="link"
                        size="small"
                        style={{ fontSize: "inherit" }}>{item.value.split("/")[item.value.split("/").length - 1]}</Button>
                </Popconfirm>
            } else {
                return <Image src={item.value} key={item.viewUrl} height={46} style={{ width: 'auto', maxWidth: '60px' }} />
            }
        }) :
            <Image src={url} height={46} style={{ width: 'auto', maxWidth: '60px' }} />
        }
    </Image.PreviewGroup>)

export default ImageView