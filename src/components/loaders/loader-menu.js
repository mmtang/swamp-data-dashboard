import React from 'react';
import { Loader } from 'semantic-ui-react';
import { container } from './loader-menu.module.css';

// This component generates a loader that looks like the select menus on index. This loader is used as placeholder, displayed while the actual select menus are rendering
export default function LoaderMenu() {
    return (
        <div className={container}>
            <div>Loading</div>
            <div>
                <Loader active inline size='mini' />
            </div>
        </div>
    )
}