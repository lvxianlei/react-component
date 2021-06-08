import { Result } from 'antd'
import { MehTwoTone } from '@ant-design/icons'
import { memo } from 'react'

const DetailSpec = memo(({ title }) => <Result icon={<MehTwoTone />} subTitle={title || "不好意思哦，此功能页面还处于努力开发中..."} />)

export default DetailSpec

export { default as PageSetting } from './PageSetting'

export { default as ChangeOrder } from './ChangeOrder'

export { default as TreeTable } from './TreeTable'

export { default as PivotTable } from './PivotTable'

export { default as DesignHouseSpace } from './DesignHouseSpace'