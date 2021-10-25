import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { inlineIcon, wrapper } from './help-icon.module.css';

export default function HelpIcon({ children }) {
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
            trigger={<Icon className={inlineIcon} name='question circle' color='blue' />}
            content={popupWrapper}
            position='right center'
            style={popupStyle}
            size='small'
        />
    )
}