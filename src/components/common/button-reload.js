import React from 'react';
import { withPrefix } from 'gatsby';
import { Button, Icon } from 'semantic-ui-react';
import { container } from './button-reload.module.css';

export default function ButtonReload() {   
    return (
        <div className={container}>
            <a href={withPrefix('/')}>
                <Button compact size='tiny'>
                    <Icon name='refresh' />
                    Reload
                </Button>
            </a>
        </div>
    )
}