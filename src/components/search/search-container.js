import React from 'react';
import { searchContainer, searchWrapper, emphasis } from './search-container.module.css';


class SearchContainer extends React.Component {
    render() {
        return (
            <div className={searchContainer}>
                Search for a <span className={emphasis}>waterbody</span> or <span className={emphasis}>monitoring station</span>
                <div id="search-div" className={searchWrapper}></div>
            </div>
        )
    }
}

export default SearchContainer;