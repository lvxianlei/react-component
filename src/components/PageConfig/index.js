import { memo } from 'react'
import { Spin, Layout, message } from 'antd'
import DropTarget from './DropTarget'
import DragSource from './DragSource'
import { DndProvider } from 'react-dnd'
import { Scrollbars } from 'react-custom-scrollbars'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { NoMatch } from '../../common'
import { useParams } from 'react-router-dom'
import { post } from '../../config/request'
import { SAVE_FIELD_URL } from '../../config/API'
import { useRequest } from 'ahooks'
import { createSevices } from '../../hooks'
import { formatPageConfig } from '../../util'
import "../../scss/PageConfig.scss"
const { Sider, Content } = Layout
const PageConfig = memo(() => {
  const { service, type, name } = useParams()
  const basePath = `/${service}/page/findPageAndField/${type}/${name}`
  const balancePath = `/${service}/balance/${type}/${name}`
  const fetchPath = type === "getConfMetaData" ? balancePath : basePath
  const { data, loading, error } = useRequest(createSevices(fetchPath, {}), { refreshDeps: [fetchPath] })

  if (loading) { return <Spin loading={`${loading}`} /> }

  if (error) { return <NoMatch status="500" /> }

  const { page, fields, pages } = formatPageConfig({ ...data, pageType: type })

  const savePageFormData = async (saveData, onSuccess) => {
    const proptyName = type === "relations" ? "pageRelations" : "pageFieldPositions"
    const postData = { ...data.page, [proptyName]: saveData }
    const submitResult = await post(SAVE_FIELD_URL, postData)
    submitResult.code === 200 && message.success(submitResult.message)
    onSuccess()
  }

  return (<DndProvider backend={HTML5Backend}>
    <Layout className="page-form-setting">
      <Sider theme={"light"} style={{ padding: '0 15px 40px 0', boxSizing: 'border-box' }}>
        <p className="title">页面配置选项</p>
        <Scrollbars autoHeight autoHeightMin={'90vh'} autoHide>
          {fields.map((item, index) => (
            <DragSource key={index} data={item} type="PageFormSetting" />
          ))}
        </Scrollbars>
      </Sider>
      <Content>
        <p className="title">配置结果</p>
        <DropTarget
          type="PageFormSetting"
          pageType={type}
          dataSource={page} pages={pages}
          savePageFormData={savePageFormData} />
      </Content>
    </Layout>
  </DndProvider>)
})

export default PageConfig
