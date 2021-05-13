import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { loadModules } from 'esri-loader';
import StationPopup from './station-popup';


class MapIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stationData: [],
            hoveredStation: {},
            hoveredWaterbody: {},
            clickedWaterbody: {}
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

    drawBPMP = (MapImageLayer) => {
        const fetchData = (url) => {
            return new Promise((resolve, reject) => {
                fetch(url)
                .then((resp) => resp.json())
                .then((d) => resolve(d));
            });
        }
        const fetchRelatedData = (feature) => {
            const waterbodyID = feature.graphic.attributes['OBJECTID'];
            const urlPolys = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer/0/queryRelatedRecords?objectIds=' + waterbodyID + '&relationshipId=2&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&datumTransformation=&f=pjson';
            const urlLines = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer/1/queryRelatedRecords?objectIds=' + waterbodyID + '&relationshipId=2&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&datumTransformation=&f=pjson';
            Promise.all([
                fetchData(urlPolys),
                fetchData(urlLines)
            ]).then((res) => {
                console.log(res);
                let buData;
                if (res[0].relatedRecordGroups && res[0].relatedRecordGroups.length > 0) {
                    buData = res[0].relatedRecordGroups[0].relatedRecords;
                } else if (res[1].relatedRecordGroups && res[1].relatedRecordGroups.length > 0) {
                    buData = res[1].relatedRecordGroups[0].relatedRecords;
                } else {
                    console.error('No related records found')
                }
                console.log(buData.map(d => d.attributes));
            });
            return '<div><ul><li>Hello</li><li>there</li></ul></div>'
        }
        const bpTemplate = {
            title: '{WB_NAME} ({OBJECTID})',
            content: fetchRelatedData
        }
        this.bpFeatures = new MapImageLayer({
            url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer',
            sublayers: [
                {
                    id: 0, // polygon sublayer
                    definitionExpression: "REG_ID = '2S'",
                    popupTemplate: bpTemplate
                }, {
                    id: 1, // line sublayer
                    definitionExpression: "REG_ID = '2S'",
                    popupTemplate: bpTemplate
                }
            ]
        });
        this.map.add(this.bpFeatures);
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
        };
        const stationTemplate = {
            content: this.stationPopup
        }

        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude&limit=500';
        fetch(url)
            .then((resp) => resp.json())
            .then((json) => json.result.records)
            .then((records) => {
                const stationData = this.convertToGeoJSON(records);
                const blob = new Blob([JSON.stringify(stationData)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                this.stations = new GeoJSONLayer({
                  id: 'stationLayer',
                  url: url,
                  outFields: ['StationName'],
                  renderer: stationRenderer,
                  popupTemplate: stationTemplate
                });
                this.map.add(this.stations);
                initializePopup();
            })
            .catch((err) => {
              console.error(err);
            });

        const initializePopup = () => {
            // hover listener
            let lResult = { attributes: { StationName: null } };
            this.view.on('pointer-move', (event) => {
                const opts = { include: this.stations };
                this.view.hitTest(event, opts).then((response) => {
                    if (response.results.length > 0) {
                        const result = response.results[0];
                        if (result.graphic.layer.id === this.stations.id) {
                            // check if you are still over the same graphic in the pointer-move event
                            // fixes the flickering issue
                            if (lResult.attributes.StationName !== result.graphic.attributes.StationName) {
                                this.setState({ 
                                    hoveredStation: {
                                        name: result.graphic.attributes.StationName
                                    }
                                });
                                this.view.popup.open({
                                    features: [result.graphic],
                                    location: result.graphic.geometry.centroid
                                });
                                lResult = result.graphic;
                            }
                        } 
                    } else {
                        //this.view.popup.close();
                    }
                });
            });
        }
    }

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
                    closeButton: false,
                    zoomIn: false
                }
            }
        });
        this.view.popup.viewModel.actions = [];
    }

    stationPopup = () => {
        const content = ReactDOMServer.renderToString(<StationPopup station={this.state.hoveredStation} />);
        return content;
    }

    componentDidMount = () => {
        // make sure the loaded modules match in exact order of the callback variables
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/layers/GeoJSONLayer', 'esri/layers/MapImageLayer'], { css: true })
        .then(([Map, MapView, FeatureLayer, GeoJSONLayer, MapImageLayer]) => {
            this.initializeMap(Map, MapView);
            this.drawBoundaries(FeatureLayer);
            this.drawStations(GeoJSONLayer);
            this.drawBPMP(MapImageLayer);
        })
        .catch(err => {
            console.error(err);
        });
    }

    componentWillUnmount = () => {
        if (this.view) {
            this.view.destroy();
        }
    }

    render() {
        return (
            <div 
                className="map" 
                ref={this.mapRef} 
                style={{ width: "60vw", height: `calc(100vh - 60px)` }} />
        )
    }
}

export default MapIndex;

