import { Spin } from 'antd'
import { SearchPane, NoMatch } from '../../common'
import { createSevices } from '../../hooks'
import { useRequest } from 'ahooks'

export default function OSearch ({ path, onFinish }) {
    const { data, loading, error } = useRequest(createSevices(path, {}), { refreshDeps: [path] })
    const handleSearchChange = (searchData, heads) => onFinish(searchData, heads)

    if (loading || !path) { return <Spin loading={`${loading}`} /> }

    if (error) { return <NoMatch status="500" /> }

    if (!!data) { return <SearchPane dataSource={data.filter(item => item.type !== "DEFAULT")} onChange={handleSearchChange} /> }
}

