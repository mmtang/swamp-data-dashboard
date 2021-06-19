import React, { useEffect, useState } from 'react';
import CardStation from './card-station';
import { title } from './nearby.module.css';


export default function NearbyStations({ nearbyStations }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (nearbyStations) {
            setLoading(false);
        }
    }, [nearbyStations])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    } else if (nearbyStations) {
        if (nearbyStations.length > 0) {
            return (
                <div>
                    <h3 className={title}>Nearby monitoring sites</h3>
                    {nearbyStations.map(d => (
                        <CardStation key={'card-' + d.StationCode} feature={d} />
                    ))}
                </div>
            )
        } else {
            return (
                <div>
                    <h3 className={title}>Nearby monitoring sites</h3>
                    <i className="light">No other monitoring sites within 3,000 meters.</i>
                </div>
            )
        }
    } else {
        return (
            <div></div>
        )
    }
}