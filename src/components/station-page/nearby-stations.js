import React, { useEffect, useState } from 'react';
import CardStation from './card-station';


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
                    <h3 style={{ margin: "25px 0 15px 0" }}>Nearby monitoring sites</h3>
                    {nearbyStations.map(d => (
                        <CardStation key={'card-' + d.StationCode} feature={d} />
                    ))}
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    } else {
        return (
            <div></div>
        )
    }
}