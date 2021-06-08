import { Button, Modal, message, Upload } from 'antd'
import { Default_Search, BASE_EXPORT_EXCEL, BASE_URL, CALL_CENTER } from '../config/API'
import { ExportOutlined, UploadOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { formatSearch, getSessionItem, getGoToPlistPath, downloadFile } from '../util'
import { post } from '../config/request'
const confirm = Modal.confirm;
/**
 * buttonType保存了所有要返回的button类型type属性和所要进行的操作
 */
const ButtonTypes = {
    //-----writed-----
    goto_edit ({ linkUrl, name, history: { push }, jsonValue, searchPath: search, disabled, service }) {
        const formURIInfo = linkUrl.replace(/^\/|\/$/g, '').replace('/base/find/form', '').split("/")
        const formService = formURIInfo[0]
        const formName = formURIInfo[1]
        const editFormId = formURIInfo[2]
        const editorPageName = `/edit/${formService}/${formName}/${editFormId}`
        const isEditor = ['汇报管理', '验收列表'].includes(name)
        const handleClick = ({ search, path }) => {
            if (path.includes("/doquery/find/")) {
                push({
                    pathname: `/searchConfig/${formService}/${formURIInfo[formURIInfo.length - 1]}`,
                    state: { url: linkUrl },
                    search
                })
                return
            }
            const haveParam = path.includes("?")
            const firstSplit = path.split(haveParam ? "?" : "/")
            const formName = haveParam ? firstSplit[0].split("/") : firstSplit
            const param = haveParam && formatSearch(path)
            const designItemListPath = `/plist/${service}/${formName[formName.length - 1]}/designId/${param.designId}`
            const routePath = {
                pathname: isEditor ? designItemListPath : editorPageName,
                state: { url: linkUrl },
                search: isEditor ? search : `${search}&jsonValue=${jsonValue && jsonValue}`
            }
            push(routePath)
        }
        return <Button
            type="link"
            size="small"
            onClick={() => handleClick({ search, path: linkUrl.replace(/^\/|\/$/g, '') })}
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //-----writed-----
    goto_view ({ name, history: { push }, searchPath: search, linkUrl, disabled, service, component }) {
        const formName = linkUrl.replace(/^\/|\/$/g, '').split("/")
        const formSubItem = `/offerDetail/${service}/${formName[1]}/${formName[2]}/${formName[3]}`
        const basePathname = `/detail/${service}/${formName[formName.length - 2]}/${formName[formName.length - 1]}`
        const pathname = component === "/home/formSubItem" ? formSubItem : basePathname

        const handleClick = ({ search, pathname, linkUrl }) => {
            push({
                pathname: pathname,
                state: { url: linkUrl },
                search
            })
        }

        return <Button
            type="link" size="small" key={linkUrl + name}
            onClick={() => handleClick({ search, pathname, linkUrl })}
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //-----writed-----
    goto_plist ({ name, history: { location, push }, searchPath: search, linkUrl, disabled, service }) {
        const handleClick = ({ search, path }) => push({
            pathname: getGoToPlistPath({ path, service, location }),
            state: { url: linkUrl },
            search
        })

        return <Button
            type="link"
            size="small"
            onClick={() => handleClick({ search, path: linkUrl.replace(/^\/|\/$/g, '') })}
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //-----writed-----
    goto_delete ({ name, history, linkUrl, disabled, onDelete, record, type }) {
        const handleClick = ({ name, linkUrl }) => {
            confirm({
                title: name,
                content: `确定要${name}？`,
                okText: '确认',
                cancelText: '取消',
                onOk () {
                    onDelete({ linkUrl, record, type })
                }
            })
        }
        return <Button
            type="link"
            size="small"
            danger
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, history, linkUrl })}>{name}</Button>
    },
    //-----writed-----
    goto_batch ({ name, history, linkUrl, disabled, checkBoxs, onUndo, type, onShowModel, popListLink }) {
        const handleClick = ({ checkBoxs, name }) => {
            checkBoxs && checkBoxs.length > 0 ?
            !popListLink ? confirm({
                    title: name,
                    content: `确认${name}？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk () { onUndo({ linkUrl, checkBoxs, type }) }
                }) : onShowModel({
                    name,
                    linkUrl,
                    type,
                    checkBoxs,
                    popListLink
                })
                : Modal.error({
                    title: name,
                    content: `请选择需要${name}的条目!`
                })
        }
        return <Button type="primary"
            style={{ margin: '14px 14px 0 0 ' }}
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, history, linkUrl, disabled, checkBoxs })}>{name}</Button>
    },
    //-----writed-----
    goto_refresh ({ name, history, linkUrl, disabled, onUndo, record, type }) {
        const handleClick = ({ name }) => {
            confirm({
                title: `确认${name}?`,
                okText: '确认',
                cancelText: '取消',
                onOk () {
                    onUndo({ linkUrl, record, type })
                }
            })
        }
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, history, linkUrl, disabled })}>{name}</Button>
    },
    goto_back ({ name, history, linkUrl, disabled, onFinished, isSuccess, type, parameter }) {
        const handleClick = ({ type, parameter }) => {
            if (name === '取消') {
                history.goBack(-1)
            } else {
                onFinished({ type, parameter })
            }
        }
        return <Button
            type="primary"
            size="small"
            onClick={() => handleClick({ type, parameter })}
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            loading={isSuccess}
            disabled={disabled ? true : false}
            style={{ marginRight: '14px' }}
        >{name}</Button>
    },
    //-----writed-----
    pop_plist ({ name, type, jsonValue, linkUrl, disabled, onShowModel, relation }) {
        const handleClick = ({ name, linkUrl, jsonValue, type }) => onShowModel({ name, linkUrl, jsonValue, type, relation })
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, type, jsonValue, linkUrl })}
        >{name}</Button>
    },
    pop_upload ({ name, type, jsonValue, linkUrl, disabled, onShowModel }) {
        const handleClick = ({ name, linkUrl, jsonValue, type }) => onShowModel && onShowModel({ name, linkUrl, jsonValue, type })
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, type, jsonValue, linkUrl })}
        >{name}</Button>
    },
    //-----writed-----
    pop_singlePlist ({ name, type, jsonValue, linkUrl, disabled, onShowModel, popListLink, record, relation }) {
        const handleClick = ({ name, linkUrl, jsonValue, type, popListLink, record }) => {
            //推送博洛尼拿到当前的id
            const recordId = record.id
            onShowModel({ name, linkUrl, jsonValue, type, popListLink, recordId, relation })
        }
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, type, jsonValue, linkUrl, popListLink, record, relation })}
        >{name}</Button>
    },
    pop_edit ({ name, type, jsonValue, linkUrl, disabled, onShowModel, record, pageButton, relation }) {
        const handleClick = ({ name, linkUrl, jsonValue, type, relation }) => onShowModel({ name, linkUrl, jsonValue, type, record, relation })
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ name, type, jsonValue, linkUrl, pageButton, relation })}>{name}</Button>
    },
    batch_plist ({ name, linkUrl, disabled }) {
        return <Button
            type="primary"
            size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}>{name}</Button>
    },
    call_up ({ name, linkUrl, disabled, record }) {
        const phoneNumber = record.customerPhone
        const callPhone = ({ name }) => {
            const hide = message.loading('正在拨打电话...', 0);
            post(`${CALL_CENTER}?pohtoNumber=${phoneNumber}`).then((res) => {
                //还没写完....
            }).catch(() => {
                hide()
                message.error('拨打失败...请重试或联系管理员处理...', 6);
            })
        }
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}
            onClick={() => callPhone({ name })}>{name}</Button>
    },
    request_tips ({ name, linkUrl, disabled, type, onRequestTips }) {
        const handleClick = ({ name, linkUrl }) => {
            const record = ""
            onRequestTips({ linkUrl, record, type })
        }
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}
            onClick={() => handleClick({ name, linkUrl })}>{name}</Button>
    },
    move_up ({ name, linkUrl, disabled }) {
        const handleClick = ({ name }) => {
            console.log('name:', name)
        }
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}
            onClick={() => handleClick({ name })}>{name}</Button>
    },
    open_new ({ name, linkUrl, disabled }) {
        const breakPath = linkUrl && linkUrl.includes("http") ? linkUrl : BASE_URL + linkUrl
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => window.open(breakPath)}>{name}</Button>
    },
    open_batch_new ({ name, linkUrl, disabled, checkBoxs }) {
        const breakPath = linkUrl && linkUrl.includes("http") ? linkUrl : BASE_URL + linkUrl
        //客服中心->判责单列表->批量打印
        const params = `?dataList=${checkBoxs}&access_token=${getSessionItem("access_token")}`
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => window.open(breakPath + params)
            }>{name}</Button>
    },
    export_current_page ({ name, linkUrl, disabled, searchParams }) {
        const handleClick = ({ linkUrl }) => {
            const fetchURI = `${BASE_EXPORT_EXCEL}${linkUrl}?access_token=${getSessionItem("access_token")}&data=${encodeURI(JSON.stringify(searchParams))}`
            downloadFile(fetchURI)
        }
        return <Button
            type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            onClick={() => handleClick({ linkUrl })}><ExportOutlined />{name}</Button>
    },
    save_form ({ name, history, linkUrl, disabled, onFinished, isSuccess, type, parameter }) {
        const handleClick = ({ type, parameter, isSuccess }) => {
            onFinished({ type, parameter, isSuccess })
        }
        return <Button
            type="primary"
            size="small"
            onClick={() => handleClick({ type, parameter, isSuccess })}
            className={disabled ? "disabled" : ''}
            loading={isSuccess}
            key={linkUrl + name}
            disabled={disabled ? true : false}>{name}</Button>
    },
    save_plist ({ name, history, linkUrl, disabled, onFinished, isSuccess, type, parameter, flag, source }) {
        const handleClick = ({ type, parameter, flag }) => {
            if (flag) {
                onFinished({ type, parameter })
            } else {
                history.push({
                    pathname: `/overview/${source.name}`,
                    search: `?loc=${formatSearch(history.location.search).loc}`
                })
            }
        }

        return <Button
            type="primary"
            size="small"
            style={{ marginRight: '14px' }}
            onClick={() => handleClick({ type, parameter, flag })}
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            loading={isSuccess}
            disabled={disabled ? true : false}>{name}</Button>
    },
    save_view ({ name, history, linkUrl, disabled, onFinished, isSuccess, type, parameter, flag, source }) {
        const linkUrlName = linkUrl.replace(/^\/|\/$/g, '').split("/")
        const handleClick = async ({ type, parameter }) => {
            if (flag) {
                onFinished({ type, linkUrlName, parameter })
            } else {
                history.push({
                    pathname: `/detail/${source.url}/${linkUrlName[linkUrlName.length - 1]}/${source.data.id}`,
                    search: `?loc=${formatSearch(history.location.search).loc}`
                })
            }
        }
        return <Button
            type="primary"
            size="small"
            onClick={() => handleClick({ history, type, parameter })}
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            loading={isSuccess}
            disabled={disabled ? true : false}>{name}</Button>
    },
    saveAndGoBack ({ name, history, linkUrl, disabled, onFinished, type, parameter }) {
        const handleClick = async ({ type, linkUrl, parameter }) => {
            const linkUrlName = linkUrl.replace(/^\/|\/$/g, '').split("/")
            onFinished({ type, linkUrlName, parameter })
        }
        return <Button size="small" onClick={() => handleClick({ linkUrl, history, type, parameter })}
            className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            key={linkUrl + name}
            type="primary">{name}</Button>
    },
    excelImport ({ name, linkUrl, disabled }) {
        const props = {
            accept: '.xlsx',
            action: BASE_URL + linkUrl,
            data: function (file) {
                return { bucket: "test", data: file.name }
            },
            onChange (info) {
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            }
        }
        return <Upload {...props} key={linkUrl + name} headers={{ Authorization: `Bearer ${getSessionItem('access_token')}` }}>
            <Button size="small" type="link" icon={<UploadOutlined />}>{name}</Button>
        </Upload>
    },
    //-----writed-----
    special_pagePlistSetting ({ name, linkUrl, disabled, history: { push }, searchPath: search }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const pathname = `/pageConfig/${urlInfo[0]}/${urlInfo[urlInfo.length - 2]}/${urlInfo[urlInfo.length - 1]}`
        const handleClick = ({ linkUrl }) => push({ pathname, state: { url: linkUrl }, search })

        return <Button size="small" type="link"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            onClick={() => handleClick({ name, linkUrl })}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //-----writed-----
    special_pageViewSetting ({ name, linkUrl, disabled, searchPath: search, history: { push } }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const pathname = `/pageConfig/${urlInfo[0]}/${urlInfo[urlInfo.length - 2]}/${urlInfo[urlInfo.length - 1]}`
        const handleClick = ({ linkUrl }) => push({ pathname, state: { url: linkUrl }, search })

        return <Button size="small" type="link"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            onClick={() => handleClick({ name, linkUrl })}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //-----writed-----
    special_pageRelationSetting ({ name, linkUrl, disabled, searchPath: search, history: { push } }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const pathname = `/pageConfig/${urlInfo[0]}/${urlInfo[urlInfo.length - 2]}/${urlInfo[urlInfo.length - 1]}`
        const handleClick = ({ linkUrl }) => push({ pathname, state: { url: linkUrl }, search })

        return <Button size="small" type="link"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            onClick={() => handleClick({ name, linkUrl })}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //-----writed-----
    special_pageFormSetting ({ name, linkUrl, disabled, searchPath: search, history: { push } }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const pathname = `/pageConfig/${urlInfo[0]}/${urlInfo[urlInfo.length - 2]}/${urlInfo[urlInfo.length - 1]}`
        const handleClick = ({ linkUrl }) => push({ pathname, state: { url: linkUrl }, search })

        return <Button size="small" type="link"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            onClick={() => handleClick({ name, linkUrl })}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //--------writed---------
    special_pageQuerySetting ({ name, linkUrl, disabled, history: { push }, searchPath: search }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const pathname = `/pageQuerySetting/${urlInfo[0]}/${urlInfo[urlInfo.length - 1]}`
        const handleClick = ({ linkUrl }) => push({ pathname, state: { url: linkUrl }, search })

        return <Button type="link" size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            onClick={() => handleClick(linkUrl)}
            disabled={disabled ? true : false}>{name}</Button>
    },
    //----writed---
    special_pageButtonSetting ({ name, linkUrl, disabled, jsonValue, history: { push }, searchPath }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const handleClick = linkUrl => push({
            pathname: `/pageButtonSetting/${urlInfo[0]}/${urlInfo[urlInfo.length - 1]}`,
            state: { url: linkUrl },
            search: `${searchPath}&jsonValue=${jsonValue && jsonValue}`
        })

        return <Button type="link" size="small"
            key={linkUrl + name} className={disabled ? "disabled" : ''}
            disabled={disabled ? true : false}
            onClick={() => handleClick(linkUrl)}
        >{name}</Button>
    },

    special_reportHeadSetting ({ name, linkUrl, disabled }) {
        return <Button type="link"
            size="small"
            key={linkUrl + name}
            className={disabled ? "disabled" : ''} disabled={disabled ? true : false}>{name}</Button>
    },

    special_reportView ({ name, linkUrl, disabled }) {
        return <Button type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}>{name}</Button>
    },

    special_reportQuerySetting ({ name, linkUrl, disabled }) {
        return <Button type="link"
            size="small"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            disabled={disabled ? true : false}>{name}</Button>
    },
    balance_pagePlistSetting ({ name, linkUrl, disabled, history: { push }, searchPath: search }) {
        const urlInfo = linkUrl.replace(/^\/|\/$/g, '').split('/')
        const pathname = `/pageConfig/${urlInfo[0]}/${urlInfo[urlInfo.length - 2]}/${urlInfo[urlInfo.length - 1]}`
        const handleClick = ({ linkUrl }) => push({ pathname, state: { url: linkUrl }, search })

        return <Button size="small" type="link"
            className={disabled ? "disabled" : ''}
            key={linkUrl + name}
            onClick={() => handleClick({ name, linkUrl })}
            disabled={disabled ? true : false}>{name}</Button>
    }
}

export default function ColumnButton (props) {
    const history = useHistory()
    const searchPath = history.location.search || Default_Search
    return (<>
        {props.pageButton && props.pageButton.map(item => ButtonTypes[item.type]({
            ...item, ...props, searchPath, history
        }))}
    </>)
}
