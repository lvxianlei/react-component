import { memo, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { ColumnButton } from '../../common'
import OTable from '../Overview/OTable'
import { PAGE_SETTING_URL } from '../../config/API'

const baseURL = {
    "pageButtonSetting": "/button/listButton",
    "pageQuerySetting": "/doquery/listDoQuery",
    "goodsProductDetailList": "/find/plist/goodsProductDetailList"
}

const getPageSettingURI = ({ pageName, buttonId, service }, match) => {
    if (pageName) {
        return `${PAGE_SETTING_URL}/${pageName}`
    }
    if (service && buttonId) {
        const { params: { type } } = match
        return `/${service}${baseURL[type]}/${buttonId}`
    }
}

const DetailSpec = memo(() => {
    const match = useRouteMatch("/:type/:service/:buttonId")
    const fetchPath = getPageSettingURI(useParams(), match)
    const [pageButton, setPageButton] = useState(null)
    const handleTableLoaded = data => setPageButton(data.pageButton)

    return (
        <>
            <ColumnButton pageButton={pageButton} />
            <OTable request={{ path: fetchPath }} onLoaded={handleTableLoaded} />
        </>
    )
})

export default DetailSpec