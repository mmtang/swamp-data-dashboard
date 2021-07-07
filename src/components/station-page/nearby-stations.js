import React, { useEffect, useState } from 'react';
import NearbyStationsResults from './nearby-stations-results';
import { title } from './nearby.module.css';


export default function NearbyStations({ nearbyStations }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (nearbyStations) {
            setLoading(false);
        }
    }, [nearbyStations])

    return (
        <div>
            <h3 className={title}>Nearby monitoring sites</h3>
            { loading ? 'Loading...' : nearbyStations.length > 0 ? <NearbyStationsResults stations={nearbyStations} /> : <i className="light">No other monitoring sites within 3,000 meters.</i> }
        </div>
    )
}