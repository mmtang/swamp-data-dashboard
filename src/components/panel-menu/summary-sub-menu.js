import React from 'react';
import SearchSubmit from '../common/search-submit';

import { Button } from 'semantic-ui-react';
import { container, menuItem } from './summary-sub-menu.module.css';

export default function SummarySubMenu({ allRowKeys, searchText, setExpandedRowKeys, setSearchText }) {   
    const handleCollapseClick = () => {
        setExpandedRowKeys([]);
    }

    const handleExpandClick = () => {
        setExpandedRowKeys(allRowKeys);
    }

    return (
        <div className={container}>
            <div className={menuItem}>
                <SearchSubmit
                    placeholderText='Search table'
                    searchText={searchText}
                    setSearchText={setSearchText}
                    theme='light'
                />
            </div>
            <div>
                <div className={menuItem}>
                    <Button attached='left' onClick={handleExpandClick} size='tiny'>Expand all</Button>
                    <Button attached='right' onClick={handleCollapseClick} size='tiny'>Collapse all</Button>
                </div>
            </div>
        </div>
    )
}