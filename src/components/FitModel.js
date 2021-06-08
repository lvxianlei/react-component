import { useState } from 'react'
import { Modal, Form, message } from 'antd'
import { Overview, Edit } from './index'
import { DesignHouseSpace } from './DetailSpec'


const noFooterTypes = ["pop_singlePlist", "plist"]
const FitModel = ({ visible, linkUrl, type, jsonValue, name, record, handleOk, checkBoxs, popListLink, recordId, handleCancel, relation }) => {
    const [form] = Form.useForm()
    const [select, setSelect] = useState([])
    const overviewSelect = event => {
        if (type !== "pop_plist") {
            handleOk && handleOk({ ...event, type, checkBoxs, popListLink, linkUrl, recordId, relation })
        } else {
            setSelect(event)
        }
    }

    // 是否是空间面积统计
    const isDesignHouseSpace = relation && relation.relatePageName === "designHouseSpace"

    const designHouseSpace = <DesignHouseSpace form={form} record={record} />

    const pop_edit = isDesignHouseSpace ? designHouseSpace : <Edit fetchURI={linkUrl} form={form} record={record} jsonValue={jsonValue} />

    const renderComponents = {
        pop_edit,
        pop_singlePlist: <Overview fetchURI={linkUrl} relation={relation} onSelect={overviewSelect} />,
        pop_plist: <Overview fetchURI={linkUrl} type="pop_plist" onSelect={overviewSelect} />,
        plist: <Overview fetchURI={linkUrl} name={name} onSelect={overviewSelect} />,
        goto_batch: <Overview fetchURI={popListLink} name={name} onSelect={overviewSelect} />
    }

    const isOnOk = {
        onOk: async () => {
            try {
                await form.validateFields()
                handleOk({ type, name, linkUrl, checkBoxs: select, form, relation })
            } catch (error) {
                message.warning("您此次填写还有不符合规则的选项，请仔细检查")
            }
        }
    }

    const isFooter = { footer: [] }

    const specialButtonProps = isContainsName => isContainsName ? isFooter : isOnOk

    return (
        <Modal
            title={name || "编辑"}
            visible={visible}
            zIndex={10}
            width={950}
            destroyOnClose
            {...specialButtonProps(noFooterTypes.includes(type))}
            onCancel={handleCancel}>
            <div className="modal-content-warp">
                {renderComponents[type]}
            </div>
        </Modal>
    )
}

export default FitModel
