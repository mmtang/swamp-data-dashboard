import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
import { timeParse, timeFormat } from 'd3';

import { stationRenderer, regionRenderer } from './map-renderer';
import { regionDict } from '../../utils/utils';

import { container } from './map-index.module.css';


export default function MapIndex2({ 
    setMapLoaded, 
    analyte, 
    region, 
    program, 
    selectedSites, 
    stationData
}) {
    // Declare component references
    const divRef = useRef(null);
    const mapRef = useRef(null);
    const viewRef = useRef(null);
    const searchRef = useRef(null);
    const stationLayerRef = useRef(null);
    const layerListRef = useRef(null);
    const regionLayerRef = useRef(null);
    const expandLayerListRef = useRef(null);
    const expandGalleryRef = useRef(null);
    const basemapGalleryRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y/%m/%d');

    const stationDataFields = [
        {
            name: 'ObjectId',
            alias: 'ObjectId',
            type: 'oid'
        },
        {
            name: 'StationCode',
            alias: 'Station Code',
            type: 'string'
        },
        {
            name: 'StationName',
            alias: 'Station Name',
            type: 'string'
        },
        {
            name: 'RegionName',
            alias: 'Region',
            type: 'string'
        },
        {
            name: 'LastSampleDate',
            alias: 'Last Sample',
            type: 'string'
        },
        {
            name: 'bioaccumulation',
            alias: 'Bioaccumulation',
            type: 'string'
        },
        {
            name: 'bioassessment',
            alias: 'Bioassessment',
            type: 'string'
        },
        {
            name: 'fhab',
            alias: 'Fhab',
            type: 'string'
        },
        {
            name: 'spot',
            alias: 'Spot',
            type: 'string'
        }
    ]

    // Converts JSON station data to graphics structure used by ArcGIS JS
    const convertStationDataToGraphics = (data) => {
        return new Promise((resolve, reject) => {
            const features = data.map((d, i) => {
                return {
                    geometry: {
                        type: 'point',
                        latitude: +d.TargetLatitude,
                        longitude: +d.TargetLongitude
                    },
                    attributes: {
                        ObjectId: i,
                        StationCode: d.StationCode,
                        StationName: d.StationName,
                        Region: d.Region.toString(),
                        RegionName: regionDict[d.Region],
                        LastSampleDate: formatDate(parseDate(d.LastSampleDate)),
                        bioaccumulation: d.Bioaccumulation,
                        bioassessment: d.Bioassessment,
                        fhab: d.Fhab,
                        spot: d.Spot
                    }
                };
            });
            resolve(features);
        })
    }

    // Draw all stations (initial load)
    const drawStations = () => {
        return new Promise((resolve, reject) => {
            loadModules(['esri/layers/FeatureLayer', 'esri/core/watchUtils'])
            .then(([FeatureLayer]) => {
                if (stationData) {
                    convertStationDataToGraphics(stationData)
                        .then(res => {
                            stationLayerRef.current = new FeatureLayer({
                                id: 'station-layer',
                                objectIdField: 'ObjectId',
                                geometryType: 'point',
                                spatialReference: 3857,
                                title: 'SWAMP Monitoring Sites',
                                source: res,
                                fields: stationDataFields,
                                outFields: ['*'],
                                renderer: stationRenderer,
                                //popupTemplate: stationTemplate
                            });
                            // Add layer to map
                            mapRef.current.add(stationLayerRef.current);

                            // Add station layer data to search
                            searchRef.current.sources.add({
                                layer: stationLayerRef.current,
                                searchFields: ['StationName', 'StationCode'],
                                suggestionTemplate: '{StationCode} - {StationName}',
                                exactMatch: false,
                                outFields: ['StationName', 'StationCode'],
                                name: 'SWAMP Monitoring Sites',
                                placeholder: 'Example: Buena Vista Park',
                                zoomScale: 14000
                            });

                            resolve();
                        });
                } else {
                    console.error('Empty data')
                }
            });
        })
    };

    const drawRegions = () => {
        return new Promise((resolve, reject) => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer'])
                .then(([FeatureLayer]) => {
                    regionLayerRef.current = new FeatureLayer({
                        id: 'region-layer',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Regional_Board_Boundary_Features/FeatureServer/1',
                        listMode: 'hide',
                        renderer: regionRenderer
                    });
                    mapRef.current.add(regionLayerRef.current);
                    resolve();
                });
            }
        })
    }

    const updateStations = () => {
        // Define the definition expressions to be used as filters on the map
        const constructDefExp = () => {
            if (program && region) {
                return `RegionName = '${region}' AND ${program} = 'True'`;
            } else if (program) {
                return `${program} = 'True'`;
            } else if (region) {
                return `RegionName = '${region}'`;
            } else if (!program && !region) {
                return '';
            }
        }
        stationLayerRef.current.definitionExpression = constructDefExp();
    }

    // Filters the station layer based on changes to the selected program or region
    useEffect(() => {
        if (mapRef.current) {
            updateStations();
        }
    }, [program, region])

    const loadSpot = () => {
        updateStations();
    }

    // Initial load
    useEffect(() => {
        const initializeMap = () => {
            return new Promise((resolve, reject) => {
                loadModules([
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/widgets/Search',
                    'esri/widgets/LayerList',
                    'esri/widgets/Expand',
                    'esri/widgets/Home',
                    'esri/widgets/BasemapGallery'
                ]).then(([Map, MapView, Search, LayerList, Expand, Home, BasemapGallery]) => {
                    mapRef.current = new Map({
                        basemap: 'topo-vector'
                    });
                    viewRef.current = new MapView({
                        container: divRef.current,
                        map: mapRef.current,
                        center: [-119.3624, 37.4204],
                        zoom: 6,
                        constraints: {
                            minZoom: 5
                        },
                        popup: {
                            dockOptions: {
                                buttonEnabled: false
                            },
                            collapseEnabled: false,
                        },
                        highlightOptions: {
                            fillOpacity: 0.5,
                            //color: [255, 0, 0, 1]
                        }
                    });
                    searchRef.current = new Search({
                        view: viewRef.current,
                        container: 'searchContainer',
                        allPlaceholder: ' ',
                        label: 'Search for a location, waterbody, or monitoring site',
                        includeDefaultSources: true,
                        locationEnabled: false,
                        popupEnabled: false,
                        autoSelect: true,
                        sources: [
                            {
                                filter: {
                                    where: "RegionAbbr = 'CA'"
                                }
                            }
                        ]
                    });
    
                    // Define layer list widget
                    layerListRef.current = new LayerList({
                        view: viewRef.current,
                        //container: 'layerListContainer',
                        listItemCreatedFunction: function(event) {
                            const item = event.item;
                            if (item.layer.type !== 'group') {
                              // don't show legend twice
                              item.panel = {
                                content: 'legend',
                                open: true
                              };
                            }
                        }
                    });
    
                    // Define expand widget for layer list
                    expandLayerListRef.current = new Expand({
                        expandIconClass: '',
                        view: viewRef.current,
                        content: layerListRef.current,
                        expanded: false
                    })
    
                    // Add layer list
                    viewRef.current.ui.add(layerListRef.current, 'top-right');
    
                    // Define basemap gallery widget
                    basemapGalleryRef.current = new BasemapGallery({
                        view: viewRef.current
                    });
                    
                    // Define expand widget for basemap gallery
                    expandGalleryRef.current = new Expand({
                        expandIconClass: 'esri-icon-basemap',
                        view: viewRef.current,
                        content: basemapGalleryRef.current,
                        expanded: false
                    })
    
                    // Add expand widget
                    viewRef.current.ui.add(expandGalleryRef.current, 'top-left');
    
                    // Add Home widget
                    const homeWidget = new Home({ view: viewRef.current });
                    viewRef.current.ui.add(homeWidget, 'top-left');
    
                    resolve();
                });
            })
        }

        // Do not load map and other related resources until stationData is available
        if (stationData) {
            setDefaultOptions({ version: '4.22' });
            loadCss();
            initializeMap().then(() => {
                Promise.all([
                    drawRegions(),
                    drawStations()
                    //drawLandUse(),
                ]).then(values => {
                    viewRef.current.whenLayerView(stationLayerRef.current)
                    .then(layerView => {
                        setTimeout(() => {
                            setMapLoaded(true);
                        }, 2000);
                    }, (error) => {
                        console.log(error);
                    })
                });
            });
        }
    }, [stationData]);

    // Change what is shown on the map based on what program is selected
    useEffect(() => {
        if (program) {
            switch(program) {
                case 'spot':
                    loadSpot();
                    break;
                default:
                    console.log('No program selected');
            }
        }
    }, [program])



    return (
        <div
            className={container}
            ref={divRef}
        />
    )
        

}