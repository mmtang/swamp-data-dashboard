import React from 'react';
import ErrorFullscreen from '../components/common/error-fullscreen';
import LayoutMap from '../components/layout/layout-map';
import Metadata from '../components/layout/metadata';

const NotFound = () => (
    <LayoutMap>
        <Metadata />
        <ErrorFullscreen>
            404: Page not found!
        </ErrorFullscreen>
    </LayoutMap>
)

export default NotFound;