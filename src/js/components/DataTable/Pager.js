import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

function Pager({numberOfItems, rowsPerPage, page, onChange}) {
    let endPage = Math.ceil(numberOfItems/rowsPerPage);

    if (endPage <= 1) return null;

    const pages = Array.from({length: endPage}, (v, k) => k + 1);

    return (
        <div className="pages">
            {page !== 1 ? <div className="page-link" onClick={() => onChange(page - 1)}>&lt;</div> : null}
            <TextField select value={page} onChange={(event, value) => onChange(value)}>
                {pages.map(pageValue => <MenuItem value={pageValue} primaryText={pageValue} key={pageValue} />)}
            </TextField>
            {page !== endPage ? <div className="page-link" onClick={() => onChange(page + 1)}>&gt;</div> : null}
        </div>
    )
}

export default Pager;