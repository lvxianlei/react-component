import { Typography, Select, Tooltip, Input, InputNumber, Button, message } from 'antd'
import { useHistory, Link } from 'react-router-dom'
import { Default_Search } from '../config/API'
import chooseRouter from '../config/chooseRouter'
import ImageView from './ImageView'
import moment from 'moment'
import { ColumnButton } from '.'
import { post } from '../config/request'
const { Paragraph } = Typography
const columnsType = {
    isLink ({ values, head: column, record, history }) {
        const searchPath = history.location.search || Default_Search
        const viewValue = column.type === "date" ? moment(values).format(column.dateFormat) : values
        return (<Link to={chooseRouter({ ...column, searchPath, record })}>{viewValue}</Link>)
    },
    string ({ values, head, pageType }) {
        const inputNames = ["amount", "memo"]
        if (pageType === "offerDetail" && inputNames.includes(head.code) && values) {
            return <Tooltip title={values}><Input bordered={false} defaultValue={values} /></Tooltip>
        }
        return <span style={{ wordWrap: 'break-word' }}>{values}</span>
    },
    date ({ values, head }) {
        return values === null || values === '' ? '' : moment(values).format(head.dateFormat)
    },
    type ({ values, head, dataSource, pageType }) {
        if (pageType === "offerDetail") {
            const optionKey = head.optionKey
            if (dataSource[optionKey] && head.option[dataSource[optionKey]]) {
                return <Select bordered={false} style={{ width: '100%' }} defaultValue={values}>
                    {head.option[dataSource[optionKey]].map((item, index) => (<Select.Option key={index} value={item.value}>{item.label}</Select.Option>))}
                </Select>
            }
            return ""
        }
        const renderValue = head.option.filter(item => item.value === values)
        return renderValue.length > 0 ? renderValue[0].label : (values || "")
    },
    gather ({ values }) {
        return <Paragraph ellipsis={{ rows: 2, expandable: true }}>{values && values[0] ? values[0].value : ''}</Paragraph>
    },
    customized ({ values }) {
        if (values instanceof Array) {
            return <Paragraph ellipsis={{ rows: 2, expandable: true }}>{
                values.map((item, index) => (<span key={index}>{item.value || item}<br /></span>))
            }</Paragraph>
        }
        return <span>{values instanceof Object ? values[0].value : values}</span>
    },
    number ({ values, head, dataSource }) {
        const handleBulur = async event => {
            const result = await post(head.updateUrl, { [head.name]: event.target.value, id: dataSource.id })
            result.code === 200 && message.success(result.message)
        }
        if (head.update === "true") {
            return <InputNumber defaultValue={values} min={0} onBlur={handleBulur} />
        }
        return values
    },
    serial ({ values }) {
        return values
    },
    text ({ values }) {
        return <Paragraph ellipsis={{ rows: 3, expandable: true }}>{values}</Paragraph>
    },
    gatherPicture ({ values }) {
        return <ImageView url={values} />
    },
    picture ({ values }) {
        return values && <ImageView url={values.url} />
    },
    child ({ values, history: { push } }) {
        const { routerName } = values
        const handleClick = () => push({
            pathname: `/home/${routerName}/detail`,
            state: {
                url: values.url
            }
        })
        return (<Button type="link" size="small" onClick={handleClick} >{values.title}</Button>)
    },
    checkbox ({ values, head }) {
        const renderValues = values instanceof Array ? head.option.filter(item => values.includes(item.value)) : head.option.filter(item => item.value === values)
        return renderValues.map(item => item.label || '').join(',')
    },
    relateButtonForCateGory ({ values, head, onShowModel }) {
        const pageButton = values.map(item => ({
            type: 'pop_plist',
            name: item.value.buttonName,
            linkUrl: item.value.plistUrl
        }))
        const labels = values.reduce((total, item) => total.concat(item.label.split(',')), [])
        return <>
            <Paragraph ellipsis={{ rows: 2, expandable: true }}>{
                labels.map((item, index) => <p key={index}>{item}</p>)
            }</Paragraph>
            <ColumnButton pageButton={pageButton} onShowModel={onShowModel} />
        </>
    },
    pageButton ({ values, head, onShowModel }) {
        return <ColumnButton pageButton={values} onShowModel={onShowModel} />
    }
}

export default function ColumHead ({ head, values = '', record, dataSource, pageType, onShowModel }) {
    const history = useHistory()
    if (head.isLink && head.isLink !== null && head.isLink !== "0") {
        return columnsType.isLink({ values, head, record, history })
    }
    if (head.name === "flowInstanceTitle") {
        return columnsType.isLink({ values, head, record, history })
    }
    if (columnsType[head.type]) {
        return columnsType[head.type]({ values, head, record, pageType, dataSource, history, onShowModel })
    }
    return <>{values}</>
}