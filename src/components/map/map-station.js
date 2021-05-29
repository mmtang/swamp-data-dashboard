import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';


export default function MapStation(props) {
    const stationMapDivRef = useRef(null);
    const stationMapRef = useRef(null);
    const stationViewRef = useRef(null);
    const markerLayerRef = useRef(null);
    

    useEffect(() => {
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
                        center: props.coordinates,
                        zoom: 10
                    });
                    resolve();
                });
            })
        }
        const drawMarker = () => {
            loadModules([
                'esri/layers/GraphicsLayer',
                'esri/Graphic',
            ]).then(([GraphicsLayer, Graphic]) => {
                const markerSymbol = {
                    type: 'simple-marker',
                    size: 8,
                    color: '#f15f2b',
                    outline: {
                        color: '#fff'
                    }
                };
                const stationMarker = new Graphic({
                    geometry: {
                        type: 'point',
                        longitude: props.coordinates[0],
                        latitude: props.coordinates[1]
                    },
                    symbol: markerSymbol
                });
                markerLayerRef.current = new GraphicsLayer({
                    graphics: [stationMarker]
                });
                stationMapRef.current.add(markerLayerRef.current);
            });
        }
        setDefaultOptions({ version: '4.16' });
        loadCss();
        initializeMap()
        .then(() => {
            drawMarker();
        });
    }, [stationMapRef, props.coordinates]);

    return (
        <div 
            className="stationMapDiv" 
            ref={stationMapDivRef}
            style={{ width: '100%', height: '260px' }} />
    )
}