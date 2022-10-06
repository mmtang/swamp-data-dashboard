import React from 'react';
import { Icon } from 'semantic-ui-react';
import { container, outerContainer } from './button-clear.module.css';

export default function ButtonClearStation({ setSelectedSites, setStation }) {   
    const handleClick = () => {
        setStation(null);
        setSelectedSites([]);  // Clear selected sites array to remove highlight on map
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