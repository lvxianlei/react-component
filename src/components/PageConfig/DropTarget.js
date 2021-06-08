import { memo, useCallback, useState } from 'react'
import { Button } from 'antd'
import { useDrop } from 'react-dnd'
import Sortable from './Sortable'
import update from 'immutability-helper'
import arrayMove from 'array-move'

const DropTarget = memo(({ dataSource, pages, type: accept, pageType, savePageFormData }) => {
    const [cards, setCards] = useState(dataSource)
    const [isSuccess, setIsSuccess] = useState(false)
    const [, dropRef] = useDrop(() => ({
        accept,
        drop: (item, monitor) => !monitor.didDrop() && setCards(cards => update(cards, { $push: [item] }))
    }))

    const handleDelete = useCallback(itemData => setCards(cards.filter(item => item.id !== itemData.id)), [cards, setCards])

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => setCards(arrayMove(cards, oldIndex, newIndex)), [cards, setCards])
    const onSuccess = () => setIsSuccess(false)
    const handleSave = () => {
        setIsSuccess(true)
        savePageFormData(cards, onSuccess)
    }
    return (<>
        <div ref={dropRef}><Sortable
            onSortEnd={onSortEnd}
            pageType={pageType}
            axis="xy"
            dataSource={cards}
            onDelete={handleDelete}
            pages={pages} />
        </div>
        <Button className="button" loading={isSuccess} type='primary' onClick={handleSave}>保存</Button>
    </>)
})

export default DropTarget