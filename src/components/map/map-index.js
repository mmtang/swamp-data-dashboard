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

    drawAttains = (FeatureLayer) => {
        const lineRenderer = {
            type: 'simple',
            symbol: {
                type: 'simple-line',
                color: '#0baca1',
            }
        };
        const polyRenderer = {
            type: 'simple',
            symbol: {
                type: "simple-fill",
                color: 'rgba(11,172,161,100)',
                outline: {
                    color: '#0baca1'
                }
            }
        }
        const attainsTemplate = {
            title: '{assessmentunitname}<br><span class="map-popup-subtitle" style="color: #00a99d">Basin Plan waterbody</span>',
            content: [
                {
                    type: 'fields',
                    fieldInfos: [
                        {
                            fieldName: 'overallstatus',
                            label: 'Status'
                        },
                        {
                            fieldName: 'on303dlist',
                            label: 'On 303(d) List'
                        },
                        {
                            fieldName: 'reportingcycle',
                            label: 'Year Reported'
                        },
                        {
                            fieldName: 'waterbodyreportlink',
                            label: 'USEPA ATTAINS Waterbody Report'
                        }
                    ]
                }
            ]
        };
        this.attainsPolys = new FeatureLayer({
            id: 'attainsPolys',
            url: 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/2',
            outfields: ['reportingcycle', 'assessmentunitname', 'assessmentunitidentifier', 'waterbodyreportlink', 'overallstatus', 'on303dlist'],
            definitionExpression: "organizationid='CA_SWRCB'",
            popupTemplate: attainsTemplate,
            renderer: polyRenderer
        });
        this.attainsLines = new FeatureLayer({
            id: 'attainsLines',
            url: 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/1',
            outfields: ['reportingcycle', 'assessmentunitname', 'assessmentunitidentifier', 'waterbodyreportlink', 'overallstatus', 'on303dlist'],
            definitionExpression: "organizationid='CA_SWRCB'",
            popupTemplate: attainsTemplate,
            renderer: lineRenderer
        })
        //this.map.addMany([this.attainsPolys, this.attainsLines]);
        this.map.add(this.attainsPolys);
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

    drawBPMP = (MapImageLayer, RelationshipQuery) => {
        const fetchData = (url) => {
            return new Promise((resolve, reject) => {
                fetch(url)
                .then((resp) => resp.json())
                .then((d) => resolve(d));
            });
        }
        // This block manually queries the attributes from the REST API
        /*
        const buildPopupContent = (feature) => {
            const waterbodyID = feature.graphic.attributes['OBJECTID'];
            const urlPolys = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer/0/queryRelatedRecords?objectIds=' + waterbodyID + '&relationshipId=0&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&datumTransformation=&f=pjson';
            const urlLines = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer/1/queryRelatedRecords?objectIds=' + waterbodyID + '&relationshipId=2&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&datumTransformation=&f=pjson';
            Promise.all([
                fetchData(urlPolys),
                fetchData(urlLines)
            ]).then((res) => {
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
        */
        const buildPopupTitle = (feature) => {
            const attributes = feature.graphic.attributes;
            if (!attributes.WB_NAME) {
                return '<span style="font-style: italic">Unnamed waterbody</span><br><span class="map-popup-subtitle" style="color: #0071bc">Basin Plan waterbody</span>'
            } else {
                return attributes.WB_NAME + '<br><span class="map-popup-subtitle" style="color: #0071bc">Basin Plan waterbody</span>';
            }
        }
        /*
        const infoTable = [
            {
                type: 'fields',
                fieldInfos: [
                    {
                        fieldName: 'relationships/2/BU_CODE',
                        label: 'Basin Plan'
                    },
                    {
                        fieldName: 'relationships/2/BU_NAME',
                        label: 'Waterbody type'
                    }
                ]
            }
        ];
        */
        const buildLinePopup = (feature) => {
            const attributes = feature.graphic.attributes;
            if (attributes.WBID_T === 'Trib') {
                attributes.WBID_T = 'Tributary';
            };
            const waterbodyID = attributes['OBJECTID'];
            const url = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer/1/queryRelatedRecords?objectIds=' + waterbodyID + '&relationshipId=2&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&datumTransformation=&f=pjson';
            return fetch(url)
                .then((resp) => resp.json())
                .then((json) => {
                    if (json.relatedRecordGroups && json.relatedRecordGroups.length > 0) {
                        const records = json.relatedRecordGroups[0].relatedRecords;
                        const buData = records.map((d) => d.attributes);
                        buData.sort((a, b) => a.BU_CODE > b.BU_CODE);
                        // Table for waterbody information
                        let table = '<table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>' + attributes.BASINPLANNAME + '</td></tr><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>' + attributes.WBID_T  + '</td></tr></tbody></table><br><h3 style="font-size: 13px">Beneficial uses</h3>'
                        // Table for beneficial uses
                        table += '<table class="esri-widget__table"><tbody>';
                        for (const d in buData) {
                            table += '<tr><th class="esri-feature-fields__field-header">' + buData[d].BU_CODE + '</th><td class="esri-feature-fields__field-data">' + buData[d].BU_NAME + '</td></tr>';
                        };
                        table += '</tbody></table>'
                        return table.toString();
                    } 
                });
        }
        const buildPolyPopup = (feature) => {
            const attributes = feature.graphic.attributes;
            const waterbodyID = attributes['OBJECTID'];
            const url = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer/0/queryRelatedRecords?objectIds=' + waterbodyID + '&relationshipId=0&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&datumTransformation=&f=pjson';
            return fetch(url)
                .then((resp) => resp.json())
                .then((json) => {
                    if (json.relatedRecordGroups && json.relatedRecordGroups.length > 0) {
                        const records = json.relatedRecordGroups[0].relatedRecords;
                        const buData = records.map((d) => d.attributes);
                        buData.sort((a, b) => a.BU_CODE > b.BU_CODE);
                        // Table for waterbody information
                        let table = '<table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>' + attributes.BASINPLANNAME + '</td></tr><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>' + attributes.WBID_T  + '</td></tr></tbody></table><br><h3 style="font-size: 13px">Beneficial uses</h3>'
                        // Table for beneficial uses
                        table += '<table class="esri-widget__table"><tbody>';
                        for (const d in buData) {
                            table += '<tr><th class="esri-feature-fields__field-header">' + buData[d].BU_CODE + '</th><td class="esri-feature-fields__field-data">' + buData[d].BU_NAME + '</td></tr>';
                        };
                        table += '</tbody></table>'
                        return table.toString();
                    } 
                });
        }
        const lineTemplate = {
            outFields: ['BASINPLANNAME', 'WB_NAME', 'WBID_T'],
            title: buildPopupTitle,
            content: buildLinePopup
        }
        const polyTemplate = {
            outFields: ['BASINPLANNAME', 'WB_NAME', 'WBID_T'],
            title: buildPopupTitle,
            content: buildPolyPopup
        }
        this.bpFeatures = new MapImageLayer({
            url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer',
            sublayers: [
                {
                    id: 0, // polygon sublayer
                    definitionExpression: "REG_ID = '2S'",
                    popupTemplate: polyTemplate
                }, {
                    id: 1, // line sublayer
                    definitionExpression: "REG_ID = '2S'",
                    popupTemplate: lineTemplate
                }
            ]
        });
        this.map.add(this.bpFeatures);
    }

    drawStations = (GeoJSONLayer) => {
        const generatePopup = () => {
            const content = ReactDOMServer.renderToString(<StationPopup station={this.state.hoveredStation} />);
            return content;
        }
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
            title: '{StationName}<br><span class="map-popup-subtitle" style="color: #f15f2b">Monitoring station</span>'
            //content: generatePopup
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
                //initializePopup();
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
                    closeButton: true,
                    zoomIn: false
                }
            }
        });
        this.view.popup.viewModel.actions = [];
    }

    componentDidMount = () => {
        // make sure the loaded modules match in exact order of the callback variables
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/layers/GeoJSONLayer', 'esri/layers/MapImageLayer', 'esri/tasks/support/RelationshipQuery'], { css: true })
        .then(([Map, MapView, FeatureLayer, GeoJSONLayer, MapImageLayer, RelationshipQuery]) => {
            this.initializeMap(Map, MapView);
            this.view.when(() => {
                //this.drawAttains(FeatureLayer);
                this.drawBoundaries(FeatureLayer);
                //this.drawStations(GeoJSONLayer);
                this.drawBPMP(MapImageLayer, RelationshipQuery);
            });
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

