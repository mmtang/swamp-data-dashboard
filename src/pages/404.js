import React from 'react';
import LayoutMap from '../components/layout/layout-map';
import ErrorFullscreen from '../components/common/error-fullscreen';

const NotFound = () => (
    <LayoutMap>
        <ErrorFullscreen>
            404: Page not found!
        </ErrorFullscreen>
    </LayoutMap>
)

export default NotFound;