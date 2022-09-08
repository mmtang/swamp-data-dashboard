import React from 'react';

import { Icon } from 'semantic-ui-react';

import { container, menuItem } from './panel-menu.module.css';


export default function PanelMenu({ program, setProgram, back=false }) {   
    const handleBackClick = () => {
        if (program) {
            setProgram(null);
        }
    }

    return (
        <div className={container}>
            { back ? 
                <div className={menuItem} onClick={handleBackClick}>
                    <Icon circular fitted inverted 
                        size='large'
                        name='reply' 
                        color='teal'
                    />
                    <span>Back</span>
                </div>
              : null
            }
            <div className={menuItem} style={{ backgroundColor: '#fff', color: '#000' }}>
                <Icon circular fitted inverted 
                    size='large'
                    name='horizontal sliders' 
                    color='teal'
                />
                <span>Controls</span>
            </div>
            <div className={menuItem}>
                <Icon circular fitted inverted 
                    size='large'
                    name='table' 
                    color='teal'
                />
                <span>Table</span>
            </div>
            <div className={menuItem}>
                <Icon circular fitted inverted 
                    size='large'
                    name='download' 
                    color='teal'
                />
                <span>Download</span>
            </div>
        </div>
    )
}