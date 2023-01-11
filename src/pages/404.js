import React from 'react';
import ErrorFullscreen from '../components/layout/error-fullscreen';
import LayoutMap from '../components/layout/layout-map';
import Metadata from '../components/layout/metadata';

const NotFound = () => (
    <LayoutMap>
        <Metadata />
        <ErrorFullscreen>
            <div>404: Page not found</div>
            <div>The page you were looking for could not be found.</div>
        </ErrorFullscreen>
    </LayoutMap>
)

export default NotFound;