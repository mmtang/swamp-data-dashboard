import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { inlineIcon, wrapper } from './help-icon.module.css';

// This component generates an icon (question mark in circle) and an accompanying popup (tooltip).
// Content can be HTML passed to the component as children.
// The 'wide' parameter accepts boolean (false, true) and 'very' for a very wide popup. 
// Documentation: https://react.semantic-ui.com/modules/popup/#variations-wide
export default function HelpIcon({ wide = false, position = 'left center', color = 'grey', children }) {
    const popupStyle = {
        borderRadius: 0,
        opacity: 1,
        padding: '1.3em',
    }

    const popupWrapper = () => {
        return (
            <div className={wrapper}>
                {children}
            </div>
        )
    }
    
    return (
        <Popup
            trigger={<Icon className={inlineIcon} name='info circle' color={color} />}
            content={popupWrapper}
            hoverable={true}
            position={position}
            style={popupStyle}
            size='small'
            wide={wide}
        />
    )
}