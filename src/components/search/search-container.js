import React from 'react';
import { searchContainer, emphasis } from './search-container.module.css';


class SearchContainer extends React.Component {
    render() {
        return (
            <div className={searchContainer}>
                <label>Search by <span class={emphasis}>waterbody</span> or <span class={emphasis}>monitoring station</span></label>
            </div>
        )
    }
}

export default SearchContainer;