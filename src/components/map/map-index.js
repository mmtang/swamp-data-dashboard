import React from 'react';
import { loadModules } from 'esri-loader';


class MapIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stationData: [],
            hoveredStation: null
        }
        this.mapRef = React.createRef();
    }

    convertToGeoJSON = (data) => {
        // converts json to geojson
        return {
            'type': 'FeatureCollection',
            'features': data.map((d) => {
                return {
                    'type': 'Feature',
                    'geometry': {
                        'coordinates': [d.TargetLongitude, d.TargetLatitude],
                        'type': 'Point'
                    },
                    'properties': {
                        'StationName': d.StationName,
                        'StationCode': d.StationCode
                    }

                }
            })
        }
    }

    drawBoundaries = (FeatureLayer) => {
        const boundariesRenderer = {
            type: 'simple',
            symbol: {
                type: "simple-fill",
                color: 'rgba(0,0,0,0)',
                outline: {
                    width: 1.4,
                    color: '#5d5d5d'
                }
            }
        }
        this.rbBoundaries = new FeatureLayer({
            id: 'boundaryLayer',
            url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Regional_Board_Boundary_Features/FeatureServer/1',
            renderer: boundariesRenderer
        });
        this.map.add(this.rbBoundaries);
    }

    drawStations = (GeoJSONLayer) => {
        const stationRenderer = {
            type: 'simple',
            symbol: {
                type: 'simple-marker',
                size: 5.5,
                color: '#f15f2b',
                outline: {
                    color: '#fff'
                }
            }
        }
        const stationTemplate = {
            content: 'Test'
        }

        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude&limit=500';
        fetch(url)
            .then((resp) => resp.json())
            .then((json) => json.result.records)
            .then((records) => {
                const stationData = this.convertToGeoJSON(records);
                const blob = new Blob([JSON.stringify(stationData)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const layer = new GeoJSONLayer({
                  id: 'stationLayer',
                  url: url,
                  renderer: stationRenderer
                });
                this.map.add(layer);
            })
            .catch((err) => {
              console.error(err);
            });
    }

    /*
    getStations = () => {
        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude&limit=500';
        return fetch(url)
            .then((resp => resp.json()))
            .then((json) => json.result.records);
    }
    */

    initializeMap = (Map, MapView) => {
        this.map = new Map({
            basemap: 'gray-vector'
        });
        this.view = new MapView({
            container: this.mapRef.current,
            map: this.map,
            center: [-119.3624, 37.5048],
            zoom: 5,
            popup: {
                actions: [],
                dockEnabled: false,
                dockOptions: {
                    buttonEnabled: false
                },
                breakpoint: false,
                collapseEnabled: false,
                visibleElements: {
                    closeButton: false
                }
            }
        });
    }

    componentDidMount = () => {
        // make sure the loaded modules match in exact order of the callback variables
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/layers/GeoJSONLayer'], { css: true })
        .then(([Map, MapView, FeatureLayer, GeoJSONLayer]) => {
            this.initializeMap(Map, MapView);
            this.drawBoundaries(FeatureLayer);
            this.drawStations(GeoJSONLayer);
        })
        .catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <div 
                className="map" 
                ref={this.mapRef} 
                style={{ width: "50vw", height: `calc(100vh - 60px)` }} />
        )
    }
}

export default MapIndex;

