import React from 'react';
import SearchSubmit from '../common/search-submit';

import { container, menuItem } from './summary-sub-menu.module.css';
import { menuWrapper } from './panel-map-menu.module.css';

export default function SummarySubMenu({ setSearchText }) {   
    return (
        <div className={container}>
            <div className={menuWrapper}>
                <div className={menuItem}>
                    <SearchSubmit
                        placeholderText='Search table'
                        setSearchText={setSearchText}
                        theme='light'
                    />
                </div>
            </div>
        </div>
    )
}