import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Column from './models/Column';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

//Material
import LinearProgress from '@material-ui/core/LinearProgress';

const UPDATE_DATA_TIMEOUT = 0;

const TABLE_ACTIONS = {
    ready: 'ready',
    rowClick: 'rowClick',
    sort: 'sort',
    loadPage: 'loadPage'
};

class DataTable extends React.PureComponent {
    static propTypes = {
        columns: PropTypes.arrayOf(PropTypes.instanceOf(Column)),
        columnRenderer: PropTypes.object,
        data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
        headerCustomRowsBelow: PropTypes.arrayOf(PropTypes.object),
        loading: PropTypes.bool,
        onAction: PropTypes.func,
        orderBy: PropTypes.object,
        rowsPerPage: PropTypes.number,
        className: PropTypes.string,
        stripped: PropTypes.bool,
        showRowHover: PropTypes.bool
    };

    static defaultProps = {
        rowsPerPage: 1000,
        columnRenderer: {},
        data: []
    };

    constructor(props) {
        super(props);
        this.rowHeight = 30;
        this.topVisibleRowIndex = 0;
        this.bottomVisibleRowIndex = 0;
        this.firstRowIndex = 0;
        this.prevFirstRowIndex = 0;
        this.state = {
            indexStart: 0,
            indexEnd: 0
        };

        // pagination
        this.rowsPerPage = props.rowsPerPage;

        // refs
        this.tableHeaderContainerComponent = null;
        this.tableHeaderComponent = null;
        this.tableBodyWrapperComponent = null;
        this.tableBodyInnerComponent = null;
        this.scrollPositionCaptionComponent = null;
        this.topVisibleRowIndexCaption = null;
        this.bottomVisibleRowIndexCaption = null;
        this.tableBodyComponent = null;
        this.tableRowSpacerBottom = null;
        this.tableRowSpacerTop = null;

        // no update
        this.visibleColumns = this.getVisibleColumns();
    }

    get tableDataLength() {
        return this.props.data.length;
    }

    get fullTableHeight() {
        return this.tableDataLength * this.rowHeight;
    }

    get visibleTableHeight() {
        return this.tableBodyComponent.tableEl.offsetHeight;
    }

    get displayedRowsLength() {
        return this.bottomVisibleRowIndex - this.topVisibleRowIndex;
    }

    get countDisplayedRows() {
        return Math.ceil(this.tableBodyWrapperComponent.offsetHeight / this.rowHeight)*5;
    }

    get potentialFirstRowIndex() {
        return Math.max(this.topVisibleRowIndex - this.displayedRowsLength * 2, 0);
    }

    componentDidMount() {
        this.tableHeaderComponent.tableEl.style.width = this.tableHeaderContainerComponent.offsetWidth + 'px';
        this.hideScrollPositionCaption();
        let tableRows = this.tableBodyComponent.tableEl.rows;
        if (tableRows.length) {
            this.updateFullTableHeight();
            this.rowHeight = tableRows[0].offsetHeight;
            this.tableRowSpacerBottom.style.height = this.fullTableHeight - this.visibleTableHeight + 'px';
            this.topVisibleRowIndex = 0;
            this.bottomVisibleRowIndex = Math.ceil(this.tableBodyWrapperComponent.offsetHeight/this.rowHeight);
            this.setScrollPositionCaption();
            //console.log(this.rowHeight, this.fullTableHeight, this.visibleTableHeight);
            this.adjustColumnsSize();
            this.tableHeaderComponent.tableEl.style.width = 'auto';
        }
        this.tableBodyInnerComponent.style.minWidth = this.tableHeaderComponent.tableEl.offsetWidth + 'px';
        const tableBody = ReactDOM.findDOMNode(this.tableBodyWrapperComponent);
        tableBody.addEventListener('scroll', this.scrollHandler.bind(this));
        this.onReadyHandler();
    }

    componentWillReceiveProps(nextProps) {
        //console.log('props received',this.props, nextProps);
        if (nextProps.data !== this.props.data) {
            //debugger;
            this.saveScrollPos();
            this.updateIndexes();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log('updated');
        if (this.prevFirstRowIndex !== this.firstRowIndex || prevState.indexEnd !== this.state.indexEnd || prevProps.data !== this.props.data) {
            // debugger;
            let tableRows = this.tableBodyComponent.tableEl.rows;
            if (tableRows.length) {
                // correct scroll pos
                this.prevFirstRowIndex = this.firstRowIndex;
                if (this.scrollPos !== this.tableBodyWrapperComponent.scrollTop) this.tableBodyWrapperComponent.scrollTop = this.scrollPos;
                this.rowHeight = tableRows[0].offsetHeight;
                this.updateSpacers();
                this.adjustColumnsSize();
                this.topVisibleRowIndex = Math.ceil(this.tableBodyWrapperComponent.scrollTop/this.rowHeight);
                this.bottomVisibleRowIndex = Math.ceil((this.tableBodyWrapperComponent.scrollTop + this.tableBodyWrapperComponent.offsetHeight)/this.rowHeight);
                this.setScrollPositionCaption();
                this.tableHeaderComponent.tableEl.style.width = 'auto';
            }
        }
    }

    updateDataHandler = () => {
        this.saveScrollPos();
        if (UPDATE_DATA_TIMEOUT > 0) {
            window.clearTimeout(this.handleUpdateTimeout);
            this.handleUpdateTimeout = window.setTimeout(() => {
                this.saveScrollPos();
                this.updateIndexes();
            }, 0);
        }
        else {
            this.updateIndexes();
        }
    };

    onReadyHandler = () => {
        if (this.props.data.length) {
            this.updateIndexes();
        }
        this.onAction(TABLE_ACTIONS.ready, {});
    };

    rowClickHandler = (e, row) => {
        this.onAction(TABLE_ACTIONS.rowClick, {event: e, row: row});
    };

    scrollHandler = e => {
        let target = e.target,
            scrollTop = target.scrollTop,
            scrollTopOffset = scrollTop + target.offsetHeight;
        this.tableHeaderComponent.tableEl.style.transform = 'translate3d('+(-1*target.scrollLeft)+'px, 0, 0)';
        this.topVisibleRowIndex = Math.ceil(scrollTop/this.rowHeight);
        this.bottomVisibleRowIndex = Math.floor(scrollTopOffset/this.rowHeight);
        this.setScrollPositionCaption();
        if (this.bottomVisibleRowIndex > this.state.indexEnd) this.showScrollPositionCaption();
        if (scrollTop <= 0 && this.firstRowIndex === 0) return;
        if ((this.bottomVisibleRowIndex > this.state.indexEnd)
            || (this.topVisibleRowIndex < this.firstRowIndex)) {
            this.updateDataHandler();
        }
    };

    saveScrollPos() {
        this.scrollPos = this.tableBodyWrapperComponent.scrollTop;
    }

    setFirstRowIndex = value => {
        this.prevFirstRowIndex = this.firstRowIndex;
        this.firstRowIndex = value || this.potentialFirstRowIndex;
    };

    getVisibleColumns = () => {
        return this.props.columns.filter(column => column.visible !== false);
    };

    updateIndexes = () => {
        this.setFirstRowIndex();
        let indexStart = this.firstRowIndex,
            indexEnd = this.firstRowIndex + this.countDisplayedRows;

        this.setState({
            indexStart: indexStart,
            indexEnd: indexEnd
        });
    };

    updateFullTableHeight = height => {
        this.tableBodyInnerComponent.style.height = (height || this.fullTableHeight) + 'px';
    };

    updateSpacers = () => {
        //debugger;
        let tableRowSpacerTop = this.firstRowIndex * this.rowHeight,
            tableRowSpacerBottom = this.fullTableHeight - (tableRowSpacerTop + this.visibleTableHeight);
        this.tableRowSpacerTop.style.height = tableRowSpacerTop + 'px';
        this.tableRowSpacerBottom.style.height = Math.max(tableRowSpacerBottom, 0) + 'px';
        this.tableBodyWrapperComponent.scrollTop = this.scrollPos;
    };

    resizeColumnsBody = (width, delta, column) => {
        // v1 (0.4 - 0.8 ms)
        let rows = this.tableBodyComponent.tableEl.rows;
        //debugger;
        for(let i = 0; i<rows.length; i++) {
            let cell = rows[i].cells[column.index],
                currentWidth = cell.style.width || '0';
            if (width) {
                cell.style.width = width + 'px';
            }
            else {
                currentWidth = currentWidth ? currentWidth.replace('px', '') : cell.offsetWidth;
                cell.style.width = +currentWidth + delta + 'px';
            }

            let cellChilds = cell.childNodes;
            for (let j = 0; j < cellChilds.length; j++) {
                if (cellChilds[j].classList.contains('mark-resize')) {
                    let cellChildCurrentWidth = cellChilds[j].style.width || '0';
                    if (width) {
                        cellChilds[j].style.width = width + 'px';
                    }
                    else {
                        cellChildCurrentWidth = cellChildCurrentWidth ? cellChildCurrentWidth.replace('px', '') : cellChilds[j].offsetWidth;
                        cellChilds[j].style.width = +cellChildCurrentWidth + delta + 'px';
                    }
                    break;
                }
            }
        }
    };

    onColumnResize = (delta, column) => {
        this.resizeColumnsBody(0, delta, column);
    };

    setScrollPositionCaption = () => {
        this.topVisibleRowIndexCaption.innerText = this.topVisibleRowIndex;
        this.bottomVisibleRowIndexCaption.innerText = this.bottomVisibleRowIndex;
    };

    hideScrollPositionCaption = () => {
        this.scrollPositionCaptionComponent.style.display = 'none';
    };

    showScrollPositionCaption = () => {
        this.scrollPositionCaptionComponent.style.display = 'block';
    };

    adjustColumnsSize = () => {
        this.tableHeaderComponent.tableEl.style.width = this.tableHeaderContainerComponent.offsetWidth + 'px';
        let headerColumns = this.tableHeaderComponent.columnsRefs;
        //debugger;
        for (let j=headerColumns.length; j--;) {
            let bodyColumn = this.tableBodyComponent.tableEl.rows[0].cells[j];
            let bodyColumnWidth = bodyColumn.clientWidth,
                headerColumn = headerColumns[j].columnEl,
                headerColumnWidth = headerColumn.clientWidth,
                newWidth = Math.max(bodyColumnWidth, headerColumnWidth);
            //console.log(bodyColumn, bodyColumnWidth, headerColumns[j],headerColumnWidth);
            headerColumn.style.width = newWidth + 'px';
            headerColumn.childNodes[0].style.width = newWidth + 'px';
            this.resizeColumnsBody(newWidth, 0, {index: j});
        }
        this.tableHeaderComponent.tableEl.style.width = 'auto';
        this.tableBodyInnerComponent.style.minWidth = this.tableHeaderComponent.tableEl.offsetWidth;
    };

    onAction = (type, params) => {
        //console.log('action ',type, params);
        if (this.props.onAction) {
            return this.props.onAction(type, params);
        }
    };

    render() {
        // console.log('---------DataTable updated----------');
        return (
            <div className={classNames("data-table", {"table-loading": this.props.loading}, this.props.className)}>
                <div className="data-table-header-wrap">
                    <div className="data-table-header" ref={ref => { this.tableHeaderContainerComponent = ref; }}>
                        <TableHeader
                            columns={this.visibleColumns}
                            orderBy={this.props.orderBy}
                            onAction={this.onAction}
                            customRowsBelow={this.props.headerCustomRowsBelow}
                            onColumnResize={this.onColumnResize}
                            ref={ref => { this.tableHeaderComponent = ref; }}/>
                    </div>
                </div>
                {this.props.loading ?
                    <div className="loading-indicator">
                        <LinearProgress style={{zIndex: 1, position: 'absolute', width: '100%'}}/>
                    </div> : null}
                <div className={classNames("data-table-body-wrap",{stripped: this.props.stripped},{hovered: this.props.showRowHover})} ref={ref => { this.tableBodyWrapperComponent = ref; }}>
                    <div className="data-table-body-inner" ref={ref => { this.tableBodyInnerComponent = ref; }}>
                        <div className="table-row-spacer" ref={ref => { this.tableRowSpacerTop = ref; }} />

                        {!this.props.data.length && !this.props.loading ?
                            <div className="no-data-text">No Data </div>
                        : null}

                        <TableBody
                            columns={this.visibleColumns}
                            columnRenderer={this.props.columnRenderer}
                            data={this.props.data}
                            indexStart={this.state.indexStart}
                            indexEnd={this.state.indexEnd}
                            rowClickHandler={this.rowClickHandler}
                            ref={ref => { this.tableBodyComponent = ref; }}
                        />

                        <div className="table-row-spacer" ref={ref => { this.tableRowSpacerBottom = ref; }} />
                    </div>
                </div>
                <div className="data-table-footer-wrap" />
                <div className="data-table-scrollposition" ref={ref => { this.scrollPositionCaptionComponent = ref; }}>
                    <span ref={ref => { this.topVisibleRowIndexCaption = ref; }}>{this.topVisibleRowIndex}</span>
                    <span>&nbsp;-&nbsp;</span>
                    <span ref={ref => { this.bottomVisibleRowIndexCaption = ref; }}>{this.bottomVisibleRowIndex}</span>...
                </div>
            </div>
        );
    };
}

export default DataTable;
