import React from 'react';
import PropTypes from 'prop-types';

class TableBody extends React.PureComponent {
    static propTypes = {
        data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
        columns: PropTypes.array,
        columnRenderer: PropTypes.object,
        rowClickHandler: PropTypes.func
    };

    constructor(props) {
        super(props);

        // refs
        this.tableEl = null;
    }

    renderColumnContent(column, row) {
        if (this.props.columnRenderer[column.name]) return this.props.columnRenderer[column.name](column, row);
        return column.renderer ? column.renderer(column, row) : row[column.name];
    }

    render() {
        let indexStart= this.props.indexStart,
            indexEnd = Math.min(this.props.data.length, this.props.indexEnd);
        const mapArr = Array.from({length: (indexEnd - indexStart)}, (v, k) => k + indexStart);
        const TableData = mapArr.map((key,i) => {
            const row = this.props.data[key];
            if (!row) return;
            return (
                <tr className="table-row" onClick={e => this.props.rowClickHandler(e, row)} key={i}>
                    {this.props.columns.map((column,i) => {
                        const tdDefaultTitle = row[column.name] ? row[column.name].toString() : null;
                        return (
                            <td className="table-cell-content" title={!column.renderer ? tdDefaultTitle : null} key={i}>
                                <div className="table-cell-content-inner mark-resize">
                                    {this.renderColumnContent(column, row)}
                                </div>
                            </td>
                        );
                    })}
                </tr>
            );
        });

        return (
            <table className="data-table-body-table" ref={ref => this.tableEl = ref}>
                <tbody>
                {TableData}
                </tbody>
            </table>
        );
    }
}

export default TableBody;