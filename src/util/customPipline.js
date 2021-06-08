export const lineClick = options => pipeline => {
    const primaryKey = pipeline.ensurePrimaryKey('singleClick')
    const onClick = (event, rowKey, row) => {
        event.stopPropagation()
        options.onClick && options.onClick(rowKey, row)
    }
    const rowPropsGetter = row => {
        const rowKey = row[primaryKey]
        return ({
            onClick: event => onClick(event, rowKey, row),
            style: { "cursor": "pointer" }
        })
    }
    return pipeline.appendRowPropsGetter(rowPropsGetter)
}

export const mapTreeUrl = ({ rowInfo }) => pipeline => {
    if (rowInfo) {
        pipeline.mapDataSource(dataSource => dataSource.map(item => item.id === rowInfo.id ? ({ ...item, ...rowInfo.data }) : item))
    }
    return pipeline
}
