import { memo } from 'react'
import { BaseTable } from 'ali-react-table'
const FitTable = memo(({ dataSource, columns }) =>
        <BaseTable
            dataSource={dataSource}
            columns={columns}
            defaultColumnWidth={140}
            useVirtual={false}
            hasStickyScroll={false}
            components={{ LoadingContentWrapper: ({ children }) => (<div className="fit-table">{children}</div>) }}
        />
)

export default FitTable