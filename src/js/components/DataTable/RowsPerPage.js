import React from 'react';
import classNames from 'classnames';

const VALUES = [100, 250, 500];

function RowsPerPage({rowsPerPage, numberOfItems, onChange}) {
    return (
        <div className="rows-per-page">
            Show
            <ul>
                {numberOfItems < VALUES[0] ?
                    numberOfItems :
                    VALUES.map(value => <li className={classNames({active: rowsPerPage == value})} onClick={() => onChange && onChange(value)} key={value}>{value}</li>)}
            </ul>
            out of {numberOfItems}
        </div>
    )
}

export default RowsPerPage;