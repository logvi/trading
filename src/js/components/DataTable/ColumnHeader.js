import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NavigationArrowDropDown from '@material-ui/icons/ArrowDropDown';
import NavigationArrowDropUp from '@material-ui/icons/ArrowDropUp';

const SORT_ORDER = ['DESC', 'ASC'];

const changeSortng = (currentSortValue) => {
    let sortIdx = SORT_ORDER.indexOf(currentSortValue),
        nextIdx = sortIdx + 1;
    if (nextIdx > SORT_ORDER.length - 1) return SORT_ORDER[0];
    return SORT_ORDER[nextIdx];
};

class ColumnHeader extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        caption: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
        main: PropTypes.bool,
        sort: PropTypes.string,
        sortable: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.width = 0;
        this.resizing = false;
        this.dragPos = {x:0, y:0};

        // refs
        this.columnEl = null;
    }

    startResize = e => {
        this.width = this.width || this.columnEl.offsetWidth;
        this.resizing = true;
        this.dragPos = {x: e.clientX, y: e.clientY};
        document.addEventListener('mousemove', this.resize);
        document.addEventListener('mouseup', this.endResize);
    };

    resize = e => {
        if (this.resizing) {
            let delta = e.clientX - this.dragPos.x;
            if ((this.width + delta) < 20) return;
            this.width += delta;
            this.props.onResizing(delta, this.props);
            this.dragPos = {x: e.clientX, y: e.clientY};
        }
    };

    endResize = () => {
        this.resizing = false;
        document.removeEventListener('mousemove', this.resize);
        document.removeEventListener('mouseup', this.endResize);
    };

    columnClickHandler = (e) => {
        if (e.target.classList.contains('resizer')) return;
        if (!this.props.sortable) return;
        let orderBy = changeSortng(this.props.sort);
        this.props.onAction('sort',{column: this.props, orderBy: orderBy});
    };

    render = () => {
        return (
            <td ref={ref => this.columnEl = ref} className={classNames({sortable: this.props.sortable}, {['sort-applyed']: this.props.sort})} onClick={this.columnClickHandler}>
                <div className="td-header-content mark-resize">
                    <div className="caption" title={typeof this.props.caption !== 'function' ? this.props.caption : null}>{typeof this.props.caption === 'function' ? this.props.caption() : this.props.caption}</div>
                    {this.props.main && this.props.sort ? <div className="sort-indicator">
                        {this.props.sort === 'ASC' ? <NavigationArrowDropUp/> : <NavigationArrowDropDown/>}
                    </div> : null}
                    <div className="resizer" onMouseDown={this.startResize}/>
                </div>
            </td>
        );
    }
}

export default ColumnHeader;