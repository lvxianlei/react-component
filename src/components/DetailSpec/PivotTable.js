import { Spin, Tabs, Input, Row, Switch } from 'antd'
import { NoMatch } from '../../common'
// import { useTablePipeline, BaseTable, features } from 'ali-react-table'
import { useRequest } from 'ahooks'
import { createSevices } from '../../hooks'
// import { TransformToPivotTable as transformResponse } from '../../util'
const PivotTable = ({ path }) => {
    const { data, loading, error } = useRequest(createSevices(path, {}, {}), { refreshDeps: [path] })
    // const pipeline = useTablePipeline({ primaryKey: 'id' })

    if (loading) { return <Spin loading={`${loading}`} /> }

    if (error) { return <NoMatch status="500" /> }

    // pipeline.input({ dataSource: data.dataSource, columns: data.columns })

    // pipeline.use(features.autoRowSpan())
    console.log(data)
    const renderTabBar = props => {
        console.log(props)
        return <Row>{props.panes.map(pane => <Input key={pane.key} value={pane.props.tab} style={{ width: 100 }} />)}</Row>
    }
    return <>
        <Switch></Switch>
        <Tabs>
            {data.filter(item => item.name).map(item => <Tabs.TabPane key={item.id} tab={item.name}>
                <Tabs tabPosition="left">
                    {item.child.map(childItem => <Tabs.TabPane tab={childItem.name} key={childItem.id}>
                        {childItem.child.map((ccItem, ccIndex) => <p key={ccIndex}>{ccIndex + 1}: {ccItem.name}</p>)}
                    </Tabs.TabPane>)}
                </Tabs>
            </Tabs.TabPane>)}
        </Tabs>
    </>
}

export default PivotTable