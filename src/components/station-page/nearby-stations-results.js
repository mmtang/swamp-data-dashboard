import React from 'react';
import CardStation from './card-station';


export default function NearbyStationsResults({ stations }) {
    return (
        <React.Fragment>
            {stations.map(d => (
                <CardStation key={'card-' + d.StationCode} feature={d} />
            ))}
        </React.Fragment>
    )
}