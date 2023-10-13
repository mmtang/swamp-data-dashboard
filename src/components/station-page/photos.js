import React from 'react';
import FullScreenImage from '../common/full-screen-image';

import { stationThumbnail } from './photos.module.css';
import { title } from './nearby-waterbodies.module.css';

// This component queries for the nearby waterbodies of a given set of coordinates (representing a monitoring station). It uses the REST API on the Water Boards ArcGIS Portal to perform a spatial query on the Integrated Report 2018 line and polygon layers. It renders the subcomponent CardWaterbody based on the number of nearby waterbody features returned from the API queries
export default function Photos({ image }) {
    if (image) {
        return (
            <div style={{ margin: '1.1em 0' }}>
                <h3 className={title}>
                    Photos
                </h3>
                <div>
                    <FullScreenImage image={image} imgClass={stationThumbnail} alt='Site picture' showIcon={false} />
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}