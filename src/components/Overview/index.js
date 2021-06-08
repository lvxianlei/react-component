import { memo, useState } from 'react'
import { useParams } from 'react-router-dom'
import OTable from './OTable'
import OSearch from './OSearch'
import { getOverviewURI, submitFormFormatting } from '../../util'
import '../../scss/Overview.scss'
import PivotTable from '../DetailSpec/PivotTable'
import { ColumnButton } from '../../common'
const Overview = memo(({ location, fetchURI, pageRelations, type, onSelect }) => {
    const params = useParams()
    const fetchPath = fetchURI || getOverviewURI(location.state, params)
    const [searchData, setSearchData] = useState({ queryUrl: '', pageButton: [] })
    const [searchParams, setSearchParams] = useState({
        current: "1",
        pageSize: "20",
        params: {}
    })

    if (params.pageName === "pivotTable") { return <PivotTable path={fetchPath} /> }

    const handleTableLoaded = ({ queryUrl = '', pageButton = [] }) => setSearchData({ queryUrl, pageButton })

    const handleFinish = (values, heads) => {
        const queryId = values.queryId
        delete values.queryId
        setSearchParams({ current: "1", pageSize: "20", params: submitFormFormatting(values, heads, "search"), queryId })
    }

    return (<>
        {!fetchURI && <ColumnButton pageButton={searchData.pageButton} searchParams={searchParams} />}
        {searchData.queryUrl && <OSearch path={searchData.queryUrl} onFinish={handleFinish} />}
        <OTable
            onLoaded={handleTableLoaded}
            isInModel={!!fetchURI}
            pageRelations={pageRelations}
            onSelect={onSelect}
            type={type}
            request={{ path: fetchPath, params: searchParams }}
        />
    </>)
})
const DefaultOverview = props => <Overview key={props.fetchURI || (props.location.pathname + props.location.search)} {...props} />
export default DefaultOverview