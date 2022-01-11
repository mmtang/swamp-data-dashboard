import React from 'react';
import ErrorFullscreen from '../components/common/error-fullscreen';
import LayoutMap from '../components/layout/layout-map';

const NotFound = () => (
    <LayoutMap>
        <ErrorFullscreen>
            404: Page not found!
        </ErrorFullscreen>
    </LayoutMap>
)

export default NotFound;