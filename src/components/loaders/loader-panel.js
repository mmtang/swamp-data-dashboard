import React from 'react';
import { Loader } from 'semantic-ui-react';

import { loaderContainer } from './loader-panel.module.css';

export default function LoaderPanel() {
    return (
        <div className={loaderContainer}>
            <Loader active inverted />
        </div>
    )
}