import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';


export default function MapStation() {
    const stationMapDivRef = useRef(null);
    const stationMapRef = useRef(null);
    const stationViewRef = useRef(null);

    useEffect(() => {
        setDefaultOptions({ version: '4.16' });
        loadCss();
        initializeMap()
        .then(() => {
            console.log('done');
        });
    }, [stationMapRef]);

    const initializeMap = () => {
        return new Promise((resolve, reject) => {
            loadModules([
                'esri/Map',
                'esri/views/MapView',
            ]).then(([Map, MapView]) => {
                stationMapRef.current = new Map({
                    basemap: 'topo-vector'
                });
                stationViewRef.current = new MapView({
                    container: stationMapDivRef.current,
                    map: stationMapRef.current,
                    center: [-119.3624, 37.5048],
                    zoom: 8
                });
                resolve();
            });
        })
    }

    return (
        <div 
            className="stationMapDiv" 
            ref={stationMapDivRef}
            style={{ width: '100%', height: '260px' }} />
    )
}