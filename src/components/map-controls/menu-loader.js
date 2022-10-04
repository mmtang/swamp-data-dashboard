import React from 'react';
import { Loader } from 'semantic-ui-react';

import { loaderContainer } from './menu-loader.module.css';

export default function MenuLoader() {   
    return (
        <div className={loaderContainer}>
            <div>Loading</div>
            <div><Loader active inline size='mini' /></div>
        </div>
    )
}