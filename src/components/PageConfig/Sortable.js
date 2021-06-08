import { CardForm } from '../../common'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import '../../scss/DropTarget.scss'

const SortableItem = SortableElement(({ data, pages, onDelete, pageType }) => <div className="drop-item" style={{ zIndex: 2 }}><CardForm
    data={data} pages={pages} pageType={pageType}
    onDelete={onDelete} /></div>)

const Sortable = SortableContainer(props => <div className="drop-target">
    {props.dataSource.map((item, index) => (<SortableItem
        index={index}
        key={`item-${index}`}
        data={item}
        {...props} />))}
</div>)

export default Sortable