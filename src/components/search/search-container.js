import React from 'react';
import { searchContainer, searchWrapper, emphasis } from './search-container.module.css';


class SearchContainer extends React.Component {
    render() {
        return (
            <div className={searchContainer}>
                <label>Search by <span className={emphasis}>waterbody</span> or <span className={emphasis}>monitoring station</span></label>
                <div id="search-div" className={searchWrapper}></div>
            </div>
        )
    }
}

export default SearchContainer;