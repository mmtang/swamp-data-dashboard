import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { searchBox, searchContainer, searchMain, searchWrapper, submitContainer } from './search-submit.module.css';

// A component for rendering a search bar with a separate (dedicated) submit button
export default function SearchSubmit({ searchText, setSearchText, theme='dark', placeholderText='' }) {
    // State variables
    const [filterText, setFilterText] = useState('');
    // Style variables
    const themeColor =  theme === 'dark' ? '#fff' : '#6e6e6e';
    const backgroundSubmitColor = theme === 'dark' ? 'rgba(0,0,0,0)' : '#eee';
    const backgroundThemeColor = theme === 'dark' ? 'rgba(0,0,0,0)' : '#fff';
    const borderThemeColor = theme === 'dark' ? `1px solid #fff` : 0;
    
    const handleClear = () => {
        setFilterText('');
    }

    const handleInputChange = (evt) => {
        if (evt) {
            setFilterText(evt.target.value);
        }
    }

    const handleKeyDown = (evt) => {
        if (evt.key === 'Enter') {
            setSearchText(filterText);
        }
    }

    const handleSubmit = () => {
        setSearchText(filterText);
    }

    useEffect(() => {
        if (searchText === '') {
            setFilterText('');
        }
    }, [searchText]);

    return (
        <div className={searchContainer} style={{ backgroundColor: `${backgroundThemeColor}`, border: `${borderThemeColor}` }}>
            <div className={searchMain} style={{ backgroundColor: `${backgroundThemeColor}` }}>
                <div className={searchWrapper}>
                    <input 
                        className={searchBox} 
                        id='station-table-search'
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholderText}
                        style={{ backgroundColor: `${backgroundThemeColor}`, color: `${themeColor}` }}
                        type='search'
                        value={filterText}
                    />
                </div>
                {/* Show clear icon when input is longer than one character */}
                { filterText.length > 0 ? 
                    <div style={{ marginRight: '4px' }}>
                        <Icon 
                            color={theme === 'dark' ? 'white' : 'grey'}
                            link
                            name='x' 
                            onClick={handleClear}
                        />
                    </div>
                    : null
                }  
            </div>
            <button className={submitContainer} onClick={handleSubmit} style={{ backgroundColor: `${backgroundSubmitColor}` }}>
                <span style={{ margin: '0 10px' }}>
                    <Icon name='search' style={{ color: `${themeColor}`, margin: 0 }} />
                </span>
            </button>
        </div>
    )
}