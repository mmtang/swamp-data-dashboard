import React from 'react';
import { Icon } from 'semantic-ui-react';
import { searchBox, searchContainer, searchMain, searchWrapper } from './table-search.module.css';


export default function TableSearch({ filterText, setFilterText }) {
    const handleClear = () => {
        setFilterText('');
    }

    const handleInputChange = (evt) => {
        if (evt) {
            setFilterText(evt.target.value);
        }
    }

    return (
        <div className={searchContainer}>
            <div className={searchMain}>
                <span style={{ marginLeft: '10px' }}>
                    <Icon name='search' style={{ color: '#b1b1b1' }} />
                </span>
                <div className={searchWrapper}>
                    <input 
                        className={searchBox} 
                        id='station-table-search' 
                        name='q' 
                        onChange={handleInputChange}
                        placeholder=''
                        type='search'
                        value={filterText}
                    />
                </div>
            </div>
            { filterText.length > 0 ? 
                <div style={{ marginRight: '4px' }}>
                    <Icon 
                        color='grey' 
                        link
                        name='x' 
                        onClick={handleClear}
                    />
                </div>
                : null
            }   
        </div>
    )
}