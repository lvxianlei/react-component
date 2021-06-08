import { useState } from 'react'
import { Spin, message } from 'antd'
import { useHistory, useParams, Prompt } from 'react-router-dom'
import { NoMatch, FitModelForm } from '../../common'
import EditForm from './EditForm'
import { SAVE_OR_UPDATE_URL } from '../../config/API'
import { useRequest } from 'ahooks'
import { formatSearch, editDataTransform, getEditURI, submitFormFormatting } from '../../util'
import { createSevices } from '../../hooks'
import { post } from '../../config/request'
import '../../scss/Edit.scss'

export default function Edit ({ fetchURI, jsonValue, record, location, onEditChange, form }) {
    const history = useHistory()
    const { service, formName } = useParams()
    const [isSuccess, setIsSuccess] = useState(false)
    const [isFlag, setIsFlag] = useState(false)
    const [formParams, setFormParams] = useState({})
    const { editPath, editJsonValue } = getEditURI({ fetchURI, jsonValue, ...useParams(), location, form, record })

    const requestService = createSevices(editPath, { "jsonValue": editJsonValue }, { transformResponse: editDataTransform })

    const { data, loading: editLoading, error: editError } = useRequest(requestService, {
        refreshDeps: [editPath, `${editJsonValue}`],
        initialData: { forms: [], pageButton: [] }
    })

    if (editLoading) {
        return <Spin loading={`${editLoading}`} />
    }

    if (editError) {
        return <NoMatch status="500" />
    }
    //此方法异步执行，必须返回promise，并且promise必须返回true||false
    //返回值控制是否跳转至成功页
    const handleFinish = async ({ type, linkUrlName, parameter }) => {
        try {
            const dataSource = data.source
            if (data.forms.length === 1) {
                await parameter.ref.current.validateFields()
            }
            setIsSuccess(true)
            const path = type ? `/${dataSource.url}${SAVE_OR_UPDATE_URL}/${dataSource.name}` : `/${service}${SAVE_OR_UPDATE_URL}/${formName}`
            const params = dataSource.hasOwnProperty('extraData') ? {
                ...dataSource,
                extraData: dataSource.extraData.map(item => ({
                    ...item,
                    data: submitFormFormatting({ ...item.data, ...parameter[item.name] }, item.head)
                }))
            } : {
                ...dataSource,
                data: submitFormFormatting({ ...dataSource.data, ...formParams }, dataSource.head)
            }
            const closeOrdeForm = await post(path, params)
            if (closeOrdeForm.code === 200 || closeOrdeForm.id) {
                message.success(closeOrdeForm.message || '成功')
                setIsSuccess(false)
                setIsFlag(true)
                switch (type) {
                    case "save_plist":
                        history.push({
                            pathname: `/overview/${closeOrdeForm.name}`,
                            search: `?loc=${formatSearch(history.location.search).loc}`
                        })
                        break
                    case "save_view":
                        history.push({
                            pathname: `/detail/${closeOrdeForm.url}/${linkUrlName[linkUrlName.length - 1]}/${closeOrdeForm.id}`,
                            search: `?loc=${formatSearch(history.location.search).loc}`
                        })
                        break
                    case "goto_back":
                        history.goBack(-1)
                        break
                    case "save_form":
                        history.block()
                        break
                    case "saveAndGoBack":
                        history.goBack(-1)
                        break
                    default:
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                setIsSuccess(false)
                                resolve(true)
                            }, 500)

                        })
                }
            } else {
                setIsSuccess(false)
            }
        } catch (error) {
            console.log(error,'-error')
            message.warning("您此次填写还有不符合规则的选项，请仔细检查")
        }

    }

    const onFormChange = data => setFormParams({ ...data })

    return (<>
        <Prompt message={() => isFlag ? true : '当前操作未保存，您确定仍要要离开吗？'} when={fetchURI ? false : true} />
        {form ? <FitModelForm form={form} dataSource={data.source} formName={`${data.source.url}_${data.source.name}`} /> : <EditForm
            forms={data.forms}
            source={data.source}
            onFinished={handleFinish}
            onEditChange={onEditChange}
            onStepChange={onFormChange}
            pageButton={fetchURI ? [] : data.pageButton} isSuccess={isSuccess} />}
    </>)
}
