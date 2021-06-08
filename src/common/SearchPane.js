import { useState, memo } from 'react'
import { Tabs } from 'antd'
import SearchForm from './SearchForm'
const { TabPane } = Tabs
const noSearchFormTypes = ["CONSTANT"]
const SearchPane = memo(({ dataSource, onChange }) => {
    const [queryId, setQueryId] = useState(dataSource[0] && dataSource[0].id)
    const changeTabs = activeKey => {
        const selectItem = dataSource.filter(item => item.id === activeKey)[0]
        if (noSearchFormTypes.includes(selectItem.type)) {
            const formDatas = selectItem.doQueryConditions.map(item => ({ name: item.name, value: item.value }))
            let formData = {}
            formDatas.forEach(item => formData[item.name] = item.value)
            formData.queryId = activeKey
            onChange(formData)
        } else {
            setQueryId(activeKey)
        }
    }

    const changeTabPane = (formData, record) => {
        formData.queryId = queryId
        onChange(formData, record)
    }

    return (
        <Tabs onChange={changeTabs}>
            {dataSource.map((item, index) => <TabPane tab={item.name} key={item.id ? item.id : index}>
                {!noSearchFormTypes.includes(item.type) && <SearchForm dataSource={item.doQueryConditions} onFinish={changeTabPane} />}
            </TabPane>)}
        </Tabs>
    )
})

export default SearchPane
