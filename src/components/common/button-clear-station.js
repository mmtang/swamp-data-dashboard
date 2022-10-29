import React from 'react';
import { Icon } from 'semantic-ui-react';
import { container, outerContainer } from './button-clear.module.css';

export default function ButtonClearStation({ setComparisonSites, setSelecting, setStation }) {   
    const handleClick = () => {
        setStation(null);
        setComparisonSites([]);  // Reset array of comparison sites; otherwise, previous selection will show up in any new selection
        setSelecting(false);  // Reset selecting mode; otherwise, sites on map will be unclickable
    }

    return (
        <div className={outerContainer}>
            <div className={container} onClick={handleClick}>
                <Icon
                    size='large'
                    name='close' 
                    color='grey'
                />
            </div>
        </div>   
    )
}