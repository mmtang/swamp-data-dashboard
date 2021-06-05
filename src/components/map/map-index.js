import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
import { timeParse, timeFormat } from 'd3';
import { convertStationsToGeoJSON, convertStationSummaryToGeoJSON } from '../../utils/utils';


export default function MapIndex({ selectedAnalyte }) {
    const divRef = useRef(null);
    const mapRef = useRef(null);
    const viewRef = useRef(null);
    const searchRef = useRef(null);
    const attainsLineRef = useRef(null);
    const attainsPolyRef = useRef(null);
    const bpLayerRef = useRef(null);
    const boundaryLayerRef = useRef(null);
    const stationLayerRef = useRef(null);
    const stationSummaryLayerRef = useRef(null);

    useEffect(() => {
        setDefaultOptions({ version: '4.16' });
        loadCss();
        initializeMap()
        .then(() => {
            drawAttains();
            drawBasinPlan();
            drawBoundaries();
            drawStations();
        });
    }, [mapRef]);

    useEffect(() => {
        if (selectedAnalyte) {
            mapRef.current.remove(stationLayerRef.current);
            if (!stationSummaryLayerRef.current) {
                drawStationAnalyteLayer();
            } else {
                updateStationAnalyteLayer();
            }
        }
    }, [selectedAnalyte])


    const updateStationAnalyteLayer = () => {
        if (stationSummaryLayerRef.current) {
            mapRef.current.remove(stationSummaryLayerRef.current);
            stationSummaryLayerRef.current = null;
            drawStationAnalyteLayer();
        }
    }

    const drawStationAnalyteLayer = () => {
        if (mapRef) {
            loadModules(['esri/layers/GeoJSONLayer'])
            .then(([GeoJSONLayer]) => {
                const increasingSym = {
                    type: 'simple-marker',
                    size: 5.5,
                    color: '#ff0000',
                    outline: {
                        color: '#fff'
                    }
                }
                const decreasingSym = {
                    type: 'simple-marker',
                    size: 5.5,
                    color: '#000',
                    outline: {
                        color: '#fff'
                    }
                }
                const noTrendSym = {
                    type: 'simple-marker',
                    size: 5.5,
                    color: '#828282',
                    outline: {
                        color: '#fff'
                    }
                }
                const notAssessedSym = {
                    type: 'simple-marker',
                    size: 5.5,
                    color: '#fff',
                    outline: {
                        color: '#363636'
                    }
                }
                const analyteRenderer = {
                    type: 'unique-value',
                    field: 'Trend',
                    uniqueValueInfos: [
                        {
                            value: 'Increasing',
                            symbol: increasingSym,
                        },
                        {
                            value: 'Decreasing',
                            symbol: decreasingSym
                        },
                        {
                            value: 'No trend',
                            symbol: noTrendSym
                        },
                        {
                            value: 'Not assessed',
                            symbol: notAssessedSym
                        }
                    ]
                };
                /*
                    symbol: {
                        type: 'web-style',
                        name: 'triangle-1',
                        styleName: 'Esri2DPointSymbolsStyle'
                    }
                }
                */
                let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude,Analyte,AllYears_Trend&limit=500';
                url += '&filters={%22Analyte%22:%22' + selectedAnalyte + '%22}'
                fetch(url)
                .then((resp) => resp.json())
                .then((json) => json.result.records)
                .then((records) => {
                    const data = convertStationSummaryToGeoJSON(records);
                    console.log(data);
                    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    stationSummaryLayerRef.current = new GeoJSONLayer({
                        id: 'stationAnalyteLayer',
                        url: url,
                        outFields: ['StationName', 'StationCode', 'Analyte', 'Trend'],
                        renderer: analyteRenderer
                    });
                    /*
                    // convert web style symbol to CIMSymbol
                    stationSummaryLayerRef.current.renderer.symbol.fetchCIMSymbol().then((cimSymbol) => {
                        stationSummaryLayerRef.current.renderer.symbol = cimSymbol;
                    });
                    */
                    mapRef.current.add(stationSummaryLayerRef.current);
                    stationSummaryLayerRef.current.queryFeatureCount()
                        .then(numFeatures => {
                            console.log(numFeatures);
                        });
                });
            });
        }
    }

    const drawStations = () => {
        const stationTemplate = {
            title: '{StationName}<br><span class="map-popup-subtitle" style="color: #f15f2b">Monitoring station</span>',
            content: buildStationPopup
        };
        const stationRenderer = {
            type: 'simple',
            symbol: {
                type: 'simple-marker',
                size: 5.5,
                color: '#fff',
                //color: '#fff',
                outline: {
                    color: '#363636'
                }
            }
        };
        if (mapRef) {
            loadModules(['esri/layers/GeoJSONLayer'])
            .then(([GeoJSONLayer]) => {
                const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude&limit=500';
                fetch(url)
                .then((resp) => resp.json())
                .then((json) => json.result.records)
                .then((records) => {
                    const stationData = convertStationsToGeoJSON(records);
                    const blob = new Blob([JSON.stringify(stationData)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    stationLayerRef.current = new GeoJSONLayer({
                        id: 'stationLayer',
                        url: url,
                        outFields: ['StationName', 'StationCode'],
                        renderer: stationRenderer,
                        popupTemplate: stationTemplate
                    });
                    mapRef.current.add(stationLayerRef.current);
                    searchRef.current.sources.add({
                        layer: stationLayerRef.current,
                        searchFields: ['StationName', 'StationCode'],
                        displayField: 'StationName',
                        exactMatch: false,
                        outFields: ['StationName', 'StationCode'],
                        name: 'Monitoring stations',
                        placeholder: 'Example: Buena Vista Park'
                    });
                });
            });
        }
    };

    const initializeMap = () => {
        return new Promise((resolve, reject) => {
            loadModules([
                'esri/Map',
                'esri/views/MapView',
                'esri/widgets/Search'
            ]).then(([Map, MapView, Search]) => {
                mapRef.current = new Map({
                    basemap: 'gray-vector'
                });
                viewRef.current = new MapView({
                    container: divRef.current,
                    map: mapRef.current,
                    center: [-119.3624, 37.5048],
                    zoom: 5,
                    popup: {
                        dockOptions: {
                            buttonEnabled: false
                        },
                        collapseEnabled: false,
                    }
                });
                if (searchRef) {
                    searchRef.current = null;
                }
                searchRef.current = new Search({
                    view: viewRef.current,
                    container: 'search-div',
                    allPlaceholder: 'Example: Buena Vista Park',
                    label: 'Search for a waterbody or monitoring station',
                    includeDefaultSources: false,
                    locationEnabled: false,
                    popupEnabled: false,
                    sources: []
                });
                resolve();
            });
        })
    }

    const drawAttains = () => {
        const buildAttainsPopup = (feature) => {
            // Manually build the popup (and popup table) so that we can replace the default values coming from ATTAINS
            const attributes = feature.graphic.attributes;
            if (attributes.on303dlist === 'Y') {
                attributes.on303dlist = 'Yes';
            } else if (attributes.on303dlist === 'N') {
                attributes.on303dlist = 'No';
            };
            // Table for waterbody information
            let table = '<table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Status</th><td>' + attributes.overallstatus + '</td></tr><tr><th class="esri-feature-fields__field-header">On 303(d) List</th><td>' + attributes.on303dlist  + '</td></tr><tr><th class="esri-feature-fields__field-header">Year Reported</th><td>' + attributes.reportingcycle + '</td></tr><tr><th class="esri-feature-fields__field-header">USEPA Attains Waterbody Report</th><td><a href="' + attributes.waterbodyreportlink + '" target="_blank" style="color: #064e96">Link</a></td></tbody></table>';
            return table.toString();
        }
        const attainsTemplate = {
            // Must include these outfields here (and in the layer creator) for the content function to receive the feature attributes
            outFields: ['overallstatus', 'on303dlist', 'reportingcycle', 'waterbodyreportlink'],
            title: '{assessmentunitname}<br><span class="map-popup-subtitle" style="color: #247BA0">Assessment waterbody</span>',
            content: buildAttainsPopup
        };
        const attainsLineRenderer = {
            type: 'simple',
            symbol: {
                type: 'simple-line',
                color: '#247BA0',
                width: '2px'
            }
        }
        const attainsPolyRenderer = {
            type: 'simple',
            symbol: {
                type: 'simple-fill',
                color: 'rgba(36,123,160,100)',
                outline: {
                    color: '#247BA0'
                }
            }
        };
        if (mapRef) {
            loadModules(['esri/layers/FeatureLayer'])
            .then(([FeatureLayer]) => {
                attainsLineRef.current = new FeatureLayer({
                    id: 'attainsLines',
                    url: 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/1',
                    outfields: ['reportingcycle', 'assessmentunitname', 'assessmentunitidentifier', 'waterbodyreportlink', 'overallstatus', 'on303dlist'],
                    definitionExpression: "organizationid='CA_SWRCB'",
                    popupTemplate: attainsTemplate,
                    renderer: attainsLineRenderer
                });
                attainsPolyRef.current = new FeatureLayer({
                    id: 'attainsPolys',
                    url: 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/2',
                    outfields: ['reportingcycle', 'assessmentunitname', 'assessmentunitidentifier', 'waterbodyreportlink', 'overallstatus', 'on303dlist'],
                    definitionExpression: "organizationid='CA_SWRCB'",
                    popupTemplate: attainsTemplate,
                    renderer: attainsPolyRenderer
                });
                mapRef.current.add(attainsLineRef.current);
                mapRef.current.add(attainsPolyRef.current);
                searchRef.current.sources.add({
                    layer: attainsLineRef.current,
                    searchFields: ['assessmentunitname'],
                    displayField: 'assessmentunitname',
                    exactMatch: false,
                    outFields: ['assessmentunitname'],
                    name: 'Assessment Rivers & Streams',
                    placeholder: 'Example: Burney Creek'
                });
                searchRef.current.sources.add({
                    layer: attainsPolyRef.current,
                    searchFields: ['assessmentunitname'],
                    displayField: 'assessmentunitname',
                    exactMatch: false,
                    outFields: ['assessmentunitname'],
                    name: 'Assessment Lakes & Areas',
                    placeholder: 'Example: Folsom Lake'
                });
            });
        }
    }

    const drawBasinPlan = () => {
        const templateTitle = (feature) => {
            const attributes = feature.graphic.attributes;
            if (!attributes.WB_NAME) {
                return '<span style="font-style: italic">Unnamed waterbody</span><br><span class="map-popup-subtitle" style="color: #0071bc">Basin Plan waterbody</span>'
            } else {
                return attributes.WB_NAME + '<br><span class="map-popup-subtitle" style="color: #0071bc">Basin Plan waterbody</span>';
            }
        }
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
                        let table = '<table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>' + attributes.BASINPLANNAME + '</td></tr><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>' + attributes.WBID_T  + '</td></tr></tbody></table><br><h3>Beneficial uses</h3>'
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
                        let table = '<table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>' + attributes.BASINPLANNAME + '</td></tr><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>' + attributes.WBID_T  + '</td></tr></tbody></table><br><h3>Beneficial uses</h3>'
                        // Table for beneficial uses
                        table += '<table class="esri-widget__table"><tbody>';
                        for (const d in buData) {
                            table += '<tr><th class="esri-feature-fields__field-header">' + buData[d].BU_CODE + '</th><td class="esri-feature-fields__field-data">' + buData[d].BU_NAME + '</td></tr>';
                        };
                        table += '</tbody></table>'
                        return table;
                    }
                });
        }
        const bpPolyTemplate = {
            outFields: ['BASINPLANNAME', 'WB_NAME', 'WBID_T'],
            title: templateTitle,
            content: buildPolyPopup
        }
        const bpLineTemplate = {
            outFields: ['BASINPLANNAME', 'WB_NAME', 'WBID_T'],
            title: templateTitle,
            content: buildLinePopup
        }
        if (mapRef) {
            loadModules(['esri/layers/MapImageLayer'])
            .then(([MapImageLayer]) => {
                bpLayerRef.current = new MapImageLayer({
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer',
                    sublayers: [
                        {
                            id: 0, // polygon sublayer
                            definitionExpression: "REG_ID = '2S'",
                            popupTemplate: bpPolyTemplate,  
                        },
                        {
                            id: 1, // line sublayer
                            definitionExpression: "REG_ID = '2S'",
                            popupTemplate: bpLineTemplate
                        }
                    ],
                    visible: false
                });
                mapRef.current.add(bpLayerRef.current);
                searchRef.current.sources.add({
                    layer: bpLayerRef.current,
                    searchFields: ['WB_NAME'],
                    displayField: 'WB_NAME',
                    exactMatch: false,
                    outFields: ['WB_NAME'],
                    name: 'Basin Plan waterbodies',
                    placeholder: 'Example: Folsom Lake'
                });
            });
        }
    }

    const drawBoundaries = () => {
        const boundaryRenderer = {
            type: 'simple',
            symbol: {
                type: "simple-fill",
                color: 'rgba(0,0,0,0)',
                outline: {
                    width: 1.4,
                    color: '#5d5d5d'
                }
            }
        };
        if (mapRef) {
            loadModules(['esri/layers/FeatureLayer'])
            .then(([FeatureLayer]) => {
                boundaryLayerRef.current = new FeatureLayer({
                    id: 'boundaryLayer',
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Regional_Board_Boundary_Features/FeatureServer/1',
                    renderer: boundaryRenderer
                });
                mapRef.current.add(boundaryLayerRef.current);
            });
        }
    }

    const buildStationPopup = (feature) => {
        let div = document.createElement('div');
        const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
        const formatDate = timeFormat('%m/%d/%Y');
        const attributes = feature.graphic.attributes;
        const stationCode = attributes['StationCode'];
        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&filters={%22StationCode%22:%22' + stationCode + '%22}&sort=%22SampleDate%22%20desc&limit=3';
        return fetch(url)
            .then(resp => resp.json())
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.SampleDate = parseDate(d.SampleDate);
                });
                // Build popup content
                let content = '<span class="small">Latest results:</span><table class="popup-table"><colgroup><col span="1" style="width: 30%;"></col><col span="1" style="width: 35%;"></col><col span="1" style="width: 35%;"></col></colgroup><tbody>';
                content += '<tr><td>' + formatDate(records[0]['SampleDate']) + '</td><td>' + records[0]['Analyte'] + '</td><td>' + records[0]['Result'] + ' ' + records[0]['Unit'] + '</td></tr>';
                content += '<tr><td>' + formatDate(records[1]['SampleDate']) + '</td><td>' + records[1]['Analyte'] + '</td><td>' + records[1]['Result'] + ' ' + records[1]['Unit'] + '</td></tr>';
                content += '<tr><td>' + formatDate(records[2]['SampleDate']) + '</td><td>' + records[2]['Analyte'] + '</td><td>' + records[2]['Result'] + ' ' + records[2]['Unit'] + '</td></tr>';
                content += '</tbody></table>';
                content += '<div style="margin: 8px 0 2px 0"><a href="/explore_data/station/?q=' + stationCode + '" target="_blank" rel="noopener noreferrer" class="popup-button">View all station data</a></div>'
                div.innerHTML = content;
                return div;
            });
    }

    return (
        <div
            className="mapDiv"
            ref={divRef}
            style={{ width: "50vw", height: `calc(100vh - 60px)` }}
        />
    )
}