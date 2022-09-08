import React from 'react';
import { Icon } from 'semantic-ui-react';
import { container, outerContainer } from './button-clear.module.css';

export default function ButtonClearStation({ setStation }) {   
    const handleClick = () => {
        setStation(null);
    }

    return (
        <div className={outerContainer}>
            <div className={container} onClick={handleClick}>
                <Icon
                    size='large'
                    name='close' 
                    color='teal'
                />
                <span>Close</span>
            </div>
        </div>   
    )
}