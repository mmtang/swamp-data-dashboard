import React from 'react';
import { Icon } from 'semantic-ui-react';
import { fsContainer, container, iconWrapper, textWrapper } from './error-fullscreen.module.css';

export default function ErrorFullscreen({ children }) {
    return (
        <div className={fsContainer}>
            <div className={container}>
                <div className={iconWrapper}>
                    <Icon name='exclamation triangle' size='huge' />
                </div>
                <div className={textWrapper}>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    )
}