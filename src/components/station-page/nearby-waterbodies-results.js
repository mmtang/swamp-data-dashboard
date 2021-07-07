import React from 'react';
import CardWaterbody from './card-waterbody';


export default function NearbyWaterbodiesResults({ waterbodies }) {
    return (
        <React.Fragment>
            {waterbodies.map(d => (
                <CardWaterbody key={'card-' + d.assessmentunitidentifier} feature={d} />
            ))}
        </React.Fragment>
    )
}