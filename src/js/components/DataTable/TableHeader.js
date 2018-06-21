import React from 'react';
import PropTypes from 'prop-types';
import ColumnHeader from './ColumnHeader';

class TableHeader extends React.PureComponent {
    static displayName = 'TableHeader';

    static propTypes = {
        columns: PropTypes.array,
        customRowsBelow: PropTypes.array,
        onColumnResize: PropTypes.func,
        orderBy: PropTypes.object,
        onAction: PropTypes.func
    };

    static defaultProps = {
        customRowsBelow: []
    };

    constructor(props) {
        super(props);
        this.columnsRefs = [];

        // refs
        this.tableEl = null;
    }

    onColumnResize = (delta, column) => {
        // (0.07 - 0.15 ms)
        let headerRows = this.tableEl.rows;
        for(let i = 0; i<headerRows.length; i++) {
            //debugger;
            let cell = headerRows[i].cells[column.index],
                currentWidth = cell.style.width;
            currentWidth = currentWidth ? currentWidth.replace('px','') : cell.offsetWidth;
            cell.style.width = +currentWidth + delta + 'px';

            let cellChild = cell.childNodes[0],
                cellChildCurrentWidth = cellChild.style.width;
            cellChildCurrentWidth = cellChildCurrentWidth ? currentWidth.replace('px','') : cellChild.offsetWidth;
            cellChild.style.width = +cellChildCurrentWidth + delta + 'px';
        }
        this.props.onColumnResize(delta, column);
    };

    displayCustomRowData = (customRow, columnName) => {
        let columnParams = customRow.columns[columnName];
        if (!columnParams) return '';
        return columnParams.renderer ? columnParams.renderer({row: customRow.data}) : columnParams;
    };

    getSortingValue = column => {
        if (!this.props.orderBy) return null;
        return this.props.orderBy[column.name];
    };

    render = () => {
        //console.log('table HEADER updated');
        this.columnsRefs = [];
        return (
            <div style={{width: 9000}}>
                <table ref={ref => this.tableEl = ref}>
                    <tbody>
                    <tr className="table-header-row">
                        {this.props.columns.map((column,i) => {
                            return <ColumnHeader main sortable={column.sortable} index={i} sort={this.getSortingValue(column)} onAction={this.props.onAction} onResizing={this.onColumnResize} name={column.name} caption={column.title} ref={column => {if(column) return this.columnsRefs.push(column);}} key={i}/>;
                        })}
                    </tr>
                    {this.props.customRowsBelow.length ? this.props.customRowsBelow.map((customRow,i) => {
                        return (
                            <tr className="table-header-row" key={'customRow'+i}>
                                {this.props.columns.map((column,i) => {
                                    return (
                                        <ColumnHeader
                                            index={i}
                                            onResizing={this.onColumnResize}
                                            caption={this.displayCustomRowData(customRow, column.name)}
                                            key={i}/>
                                    );
                                })}
                            </tr>
                        );
                    }): null}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TableHeader;