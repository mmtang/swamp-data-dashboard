import React, { useEffect, useState } from 'react';
import NearbyStationsResults from './nearby-stations-results';
import { title } from './nearby.module.css';


export default function NearbyStations({ nearbyStations }) {
    const [loading, setLoading] = useState(true);
    const [stations, setStations] = useState(null);

    useEffect(() => {
        if (nearbyStations) {
            if (nearbyStations.length > 5) {
                setStations(nearbyStations.slice(0, 5));
            } else {
                setStations(nearbyStations);
            }
            setLoading(false);
        }
    }, [nearbyStations])

    return (
        <div>
            <h3 className={title}>Nearby monitoring sites</h3>
            { loading ? <i className="light">Loading...</i> : stations.length > 0 ? <NearbyStationsResults stations={stations} /> : <i className="light">No other monitoring sites within 2,000 meters.</i> }
        </div>
    )
}