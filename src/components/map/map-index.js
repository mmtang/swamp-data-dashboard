import React, { useState, useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
import { timeParse, timeFormat } from 'd3';
import { irLineRenderer, irPolyRenderer, regionRenderer, stationRenderer } from './map-renderer';
import { regionDict, irRegionDict, stationDataFields, stationDataTableFields, stationSummaryDataFields, stationSummaryTableFields, habitatAnalytes } from '../../utils/utils';
import { container } from './map-index.module.css';


export default function MapIndex({ setLoaded, selectedAnalyte, selectedRegion, selectedProgram, clickedSite, selectedSites, setSelectedSites, setTableData, filteredByExtent, setFilteredByExtent, zoomedToSites, setZoomedToSites }) {
    const [sites, setSites] = useState([]);

    const divRef = useRef(null);
    const mapRef = useRef(null);
    const viewRef = useRef(null);
    const searchRef = useRef(null);
    const landUseLayerRef = useRef(null);
    const irLayerRef = useRef(null);
    const irLineRef = useRef(null);
    const irPolyRef = useRef(null);
    const bpLayerRef = useRef(null);
    const regionLayerRef = useRef(null);
    const stationLayerRef = useRef(null);
    const stationSummaryLayerRef = useRef(null);
    const layerListRef = useRef(null);
    // This ref is used to store the old array of site code strings. Will be compared to the new array.
    const selectedSitesRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y/%m/%d');

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
                        LastSampleDate: formatDate(parseDate(d.LastSampleDate))
                    }
                };
            });
            resolve(features);
        })
    }

    const convertStationSummaryDataToGraphics = (data) => {
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
                        Analyte: d.Analyte,
                        LastSampleDate: formatDate(parseDate(d.LastSampleDate)),
                        Trend: d.AllYears_R_Trend
                    }
                };
            });
            resolve(features);
        })
    }

    useEffect(() => {
        // This function queries the current map extent and returns an array of attributes for those stations found within the extent. The array is used to update the station table on the main dashboard page.
        const filterTableByExtent = () => {
            const layer = selectedAnalyte ? stationSummaryLayerRef.current : stationLayerRef.current;
            viewRef.current.whenLayerView(layer).then(layerView => {  
                layerView.queryFeatures({
                    geometry: viewRef.current.extent
                }).then(results => {
                    const features = results.features;
                    const featureData = features.map(d => {
                        if (selectedAnalyte) {
                            return {
                                StationCode: d.attributes.StationCode,
                                StationName: d.attributes.StationName,
                                RegionName: d.attributes.RegionName,
                                Analyte: d.attributes.Analyte,
                                Trend: d.attributes.Trend,
                                LastSampleDate: d.attributes.LastSampleDate
                            }
                        } else {
                            return {
                                StationCode: d.attributes.StationCode,
                                StationName: d.attributes.StationName,
                                RegionName: d.attributes.RegionName,
                                LastSampleDate: d.attributes.LastSampleDate
                            }
                        }
                    });
                    setTableData(featureData);
                })
            })
        }
        // This function resets the filter so that all site records show up in the table
        const resetTableRecords = () => {
            if (selectedAnalyte) {
                updateTableWithStationSummaryData();
            } else if (!selectedAnalyte) {
                updateTableWithStationData();
                setFilteredByExtent(false);
            } else {
                console.error();
            }
        }
        if (stationLayerRef.current) {
            // Check that the station layer exists
            // This is important for the initial load
            if (stationLayerRef.current) {  
                // Check if the button has been pressed (true) or unpressed (false)
                if (filteredByExtent) {
                    filterTableByExtent();
                } else if (!filteredByExtent) {
                    resetTableRecords();
                } else {
                    console.error();
                }  
            };
        }
    }, [filteredByExtent])

    useEffect(() => {
        // This function queries the selected sites from the current station layer, gets the extent, and then zooms/fits the extent to the map window.
        const zoomToSelected = () => {
            // Get the layer ID of the current station layer
            const layer = selectedAnalyte ? stationSummaryLayerRef.current : stationLayerRef.current;
            const query = layer.createQuery();
            // Query all features from the layer and then get the Object ID for features that match the selected site codes
            layer.queryFeatures(query)
            .then(response => {
                const features = response.features;
                const matches = features.filter(d => selectedSites.includes(d.attributes.StationCode));
                const featureIds = matches.map(d => d.attributes.ObjectId);
                // Set the query's objectId
                query.objectIds = featureIds;
                // Must get the geometry to be able to determine the extent and zoom
                query.returnGeometry = true;
                // Query the station layer with the new query (object ids)
                layer.queryFeatures(query).then((results) => {
                    // Zoom to the results
                    // There are two methods depending on how many sites are selected
                    if (query.objectIds.length > 1) {
                        // For multiple selected sites
                        viewRef.current.goTo(results.features).catch((error) => {
                            if (error.name != 'AbortError') {
                                console.error(error);
                            }
                        });
                    } else {
                        // For one selected site. The operation for multiple sites does not handle single site selections well (don't know why)
                        const feature = results.features[0];
                        viewRef.current.goTo({
                            target: feature.geometry,
                            zoom: 13
                        });
                    }
                });
            })
        }
        if (zoomedToSites) {
            zoomToSelected();
            setZoomedToSites(false);
        }
    }, [zoomedToSites])

    // Initial load
    useEffect(() => {
        const drawStations = () => {
            const stationTemplate = {
                title: '{StationName}<br><span class="map-popup-subtitle" style="color: #f15f2b">Monitoring station</span>',
                content: buildStationPopup
            };
            loadModules(['esri/layers/FeatureLayer', 'esri/core/watchUtils'])
                .then(([FeatureLayer, watchUtils]) => {
                    if (mapRef) {
                        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude,Region,LastSampleDate&limit=5000';
                        fetch(url)
                        .then((resp) => resp.json())
                        .then((json) => json.result.records)
                        .then((records) => {
                            convertStationDataToGraphics(records)
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
                                    popupTemplate: stationTemplate
                                });
                                // Add layer to map
                                mapRef.current.add(stationLayerRef.current);
                                // Populate table
                                updateTableWithStationData();
                                // Add station layer data to search
                                searchRef.current.sources.add({
                                    layer: stationLayerRef.current,
                                    searchFields: ['StationName', 'StationCode'],
                                    displayField: 'StationName',
                                    exactMatch: false,
                                    outFields: ['StationName', 'StationCode'],
                                    name: 'SWAMP Monitoring Sites',
                                    placeholder: 'Example: Buena Vista Park',
                                    zoomScale: 14000
                                });
                                /*
                                viewRef.current.whenLayerView(stationLayerRef.current)
                                .then(layerView => {
                                    watchUtils.whenFalse(layerView, 'updating', () => {
                                        setLoaded(true);
                                    });
                                });
                                */
                            });
                        });
                    }
                });
        };
        setDefaultOptions({ version: '4.20' });
        loadCss();
        initializeMap()
        .then(() => {
            drawStations();
            drawRegions();
            drawIntegratedReport();
            drawLandUse();
            drawBasinPlan();
            setLoaded(true);
        });
    }, [mapRef]);

    useEffect(() => {
        const updateStationSummaryLayer = () => {
            if (stationSummaryLayerRef.current) {
                mapRef.current.remove(stationSummaryLayerRef.current);
                stationSummaryLayerRef.current = null;
                drawStationSummaryLayer();
            }
        }
        const drawStationSummaryLayer = () => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer', 'esri/symbols/CIMSymbol', 'esri/symbols/support/cimSymbolUtils'])
                .then(([FeatureLayer, CIMSymbol, cimSymbolUtils]) => {
                    const arrowDecreasing = new CIMSymbol({
                        "data": {
                          "type": "CIMSymbolReference",
                          "symbol": {
                            "type": "CIMPointSymbol",
                            "symbolLayers": [
                              {
                                "type": "CIMVectorMarker",
                                "enable": true,
                                "anchorPoint": {
                                  "x": 0,
                                  "y": 0,
                                  "z": 0
                                },
                                "anchorPointUnits": "Relative",
                                "dominantSizeAxis3D": "Y",
                                "size": 10,
                                "billboardMode3D": "FaceNearPlane",
                                "frame": {
                                  "xmin": 0,
                                  "ymin": 0,
                                  "xmax": 17,
                                  "ymax": 17
                                },
                                "markerGraphics": [
                                  {
                                    "type": "CIMMarkerGraphic",
                                    "geometry": {
                                      "rings": [
                                        [
                                          [
                                            0,
                                            0
                                          ],
                                          [
                                            8.61,
                                            14.85
                                          ],
                                          [
                                            17,
                                            0
                                          ],
                                          [
                                            0,
                                            0
                                          ]
                                        ]
                                      ]
                                    },
                                    "symbol": {
                                      "type": "CIMPolygonSymbol",
                                      "symbolLayers": [
                                        {
                                          "type": "CIMSolidFill",
                                          "enable": true,
                                          "color": [
                                            0,
                                            0,
                                            0,
                                            255
                                          ]
                                        }
                                      ]
                                    }
                                  }
                                ],
                                "scaleSymbolsProportionally": true,
                                "respectFrame": true,
                                "rotation": 180
                              }
                            ],
                            "haloSize": 1,
                            "scaleX": 1,
                            "angleAlignment": "Display",
                            "version": "2.0.0",
                            "build": "8933"
                          }
                        }
                    });
                    const arrowIncreasing = new CIMSymbol({
                        "data": {
                          "type": "CIMSymbolReference",
                          "symbol": {
                            "type": "CIMPointSymbol",
                            "symbolLayers": [
                              {
                                "type": "CIMVectorMarker",
                                "enable": true,
                                "anchorPoint": {
                                  "x": 0,
                                  "y": 0,
                                  "z": 0
                                },
                                "anchorPointUnits": "Relative",
                                "dominantSizeAxis3D": "Y",
                                "size": 10,
                                "billboardMode3D": "FaceNearPlane",
                                "frame": {
                                  "xmin": 0,
                                  "ymin": 0,
                                  "xmax": 17,
                                  "ymax": 17
                                },
                                "markerGraphics": [
                                  {
                                    "type": "CIMMarkerGraphic",
                                    "geometry": {
                                      "rings": [
                                        [
                                          [
                                            0,
                                            0
                                          ],
                                          [
                                            8.61,
                                            14.85
                                          ],
                                          [
                                            17,
                                            0
                                          ],
                                          [
                                            0,
                                            0
                                          ]
                                        ]
                                      ]
                                    },
                                    "symbol": {
                                      "type": "CIMPolygonSymbol",
                                      "symbolLayers": [
                                        {
                                          "type": "CIMSolidFill",
                                          "enable": true,
                                          "color": [
                                            230,
                                            0,
                                            0,
                                            255
                                          ]
                                        }
                                      ]
                                    }
                                  }
                                ],
                                "scaleSymbolsProportionally": true,
                                "respectFrame": true
                              }
                            ],
                            "haloSize": 1,
                            "scaleX": 1,
                            "angleAlignment": "Display",
                            "version": "2.0.0",
                            "build": "8933"
                          }
                        }
                    });
                    const notAssessedSym = {
                        type: 'simple-marker',
                        size: 5.5,
                        color: '#fff',
                        outline: {
                            color: '#363636'
                        }
                    }
                    const noTrendSym = {
                        type: 'simple-marker',
                        size: 6,
                        color: '#828282',
                        outline: {
                            color: '#fff'
                        }
                    }
                    const analyteRenderer = {
                        type: 'unique-value',
                        field: 'Trend',
                        uniqueValueInfos: [
                            {
                                value: 'Increasing',
                                symbol: arrowIncreasing,
                            },
                            {
                                value: 'Decreasing',
                                symbol: arrowDecreasing
                            },
                            {
                                value: 'No trend',
                                symbol: noTrendSym
                            },
                            {
                                value: 'Insufficient data',
                                symbol: notAssessedSym
                            },
                            {
                                value: 'Error',
                                symbol: notAssessedSym
                            }
                        ]
                    };
                    const analyteTemplate = {
                        title: '{StationName}<br><span class="map-popup-subtitle" style="color: #f15f2b">Monitoring station</span>',
                        content: buildStationPopup
                    }
                    let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude,Analyte,LastSampleDate,Region,AllYears_R_Trend&limit=5000';
                    url += '&filters={%22Analyte%22:%22' + encodeURIComponent(selectedAnalyte) + '%22}'
                    fetch(url)
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        convertStationSummaryDataToGraphics(records)
                        .then(res => {
                            stationSummaryLayerRef.current = new FeatureLayer({
                                id: 'station-summary-layer',
                                objectIdField: 'ObjectId',
                                geometryType: 'point',
                                spatialReference: 3857,
                                title: 'SWAMP Monitoring Sites - Trends',
                                source: res,
                                fields: stationSummaryDataFields,
                                outFields: ['*'],
                                renderer: analyteRenderer,
                                popupTemplate: analyteTemplate
                            });
                            if (selectedRegion) {
                                stationSummaryLayerRef.current.definitionExpression = `RegionName = '${selectedRegion}'`;
                            }
                            // Add to map
                            mapRef.current.add(stationSummaryLayerRef.current);

                            // Query features and then update table
                            updateTableWithStationSummaryData();
                        })
                    });
                });
            }
        }
        if (mapRef.current) {
            if (selectedAnalyte) {
                    mapRef.current.remove(stationLayerRef.current);
                if (!stationSummaryLayerRef.current) {
                    drawStationSummaryLayer();
                } else {
                    updateStationSummaryLayer();
                }
            } else {
                mapRef.current.remove(stationSummaryLayerRef.current);
                mapRef.current.add(stationLayerRef.current);
                updateTableWithStationData();
            }
        }
        setFilteredByExtent(false);
    }, [selectedAnalyte])

    const updateTableWithStationData = () => {
        const query = stationLayerRef.current.createQuery();
        stationLayerRef.current.queryFeatures(query)
            .then(response => {
                const features = response.features;
                const featureData = features.map(d => {
                    return {
                        StationName: d.attributes.StationName,
                        StationCode: d.attributes.StationCode,
                        RegionName: d.attributes.RegionName,
                        LastSampleDate: d.attributes.LastSampleDate
                    }
                });
                setTableData(featureData);
            });
    }
    const updateTableWithStationSummaryData = () => {
        // Check that the layer exists before trying to query
        if (stationSummaryLayerRef.current) {
            const query = stationSummaryLayerRef.current.createQuery();
            stationSummaryLayerRef.current.queryFeatures(query)
                .then(response => {
                    const features = response.features;
                    const featureData = features.map(d => {
                        return {
                            StationName: d.attributes.StationName,
                            StationCode: d.attributes.StationCode,
                            RegionName: d.attributes.RegionName,
                            Analyte: d.attributes.Analyte,
                            Trend: d.attributes.Trend,
                            LastSampleDate: d.attributes.LastSampleDate
                        }
                    });
                    setTableData(featureData);
                });
        }
    }

    useEffect(() => {
        if (mapRef.current) {
            const bpPolys = bpLayerRef.current.findSublayerById(0);
            const bpLines = bpLayerRef.current.findSublayerById(1);
            if (selectedRegion) {
                // Filter stations and table
                if (stationLayerRef.current) { 
                    stationLayerRef.current.definitionExpression = `RegionName = '${selectedRegion}'`;
                    updateTableWithStationData();
                }
                if (stationSummaryLayerRef.current) {
                    console.log(`RegionName = '${selectedRegion}'`);
                    stationSummaryLayerRef.current.definitionExpression = `RegionName = '${selectedRegion}'`;
                    updateTableWithStationSummaryData();
                }
                // Filter IR layers
                irLineRef.current.definitionExpression = `rb = '${irRegionDict[selectedRegion]}'`;
                irPolyRef.current.definitionExpression = `rb = '${irRegionDict[selectedRegion]}'`
                // Filter BPMP layers
                bpPolys.definitionExpression = `BASINPLANNAME = '${selectedRegion}'`;
                bpLines.definitionExpression = `BASINPLANNAME = '${selectedRegion}'`;
                // Zoom to region
                loadModules(['esri/views/layers/LayerView', 'esri/rest/support/Query'])
                .then(([LayerView, Query]) => {
                    if (viewRef.current) {
                        viewRef.current.whenLayerView(regionLayerRef.current).then((layerView) => {
                            const query = regionLayerRef.current.createQuery();
                            query.where = `rb_name = '${selectedRegion}'`;
                            regionLayerRef.current.queryFeatures(query).then(results => {
                                const feature = results.features[0];
                                viewRef.current.goTo(feature.geometry);
                            })
                        })
                    }
                });
            } else {
                // Unfilter station layers and table
                if (stationLayerRef.current) {
                    stationLayerRef.current.definitionExpression = '';
                    updateTableWithStationData();
                }
                if (stationSummaryLayerRef.current) {
                    stationSummaryLayerRef.current.definitionExpression = '';
                    updateTableWithStationSummaryData();
                }
                // Unfilter IR layers
                irLineRef.current.definitionExpression = '';
                irPolyRef.current.definitionExpression = '';
                // Unfilter BPMP layers
                bpPolys.definitionExpression = "BASINPLANNAME = ''";
                bpLines.definitionExpression = "BASINPLANNAME = ''";
            }
        }
    }, [selectedRegion]);

    useEffect(() => {
        // This useEffect highlights selected sites on the map and handles any changes (adding/removing sites) initiated by the dashboard table.
        const addSiteHighlight = (layer, siteCode) => {
            viewRef.current.whenLayerView(layer.current).then((layerView) => {
                const query = layer.current.createQuery();
                query.where = `StationCode = '${siteCode}'`;
                layer.current.queryFeatures(query)
                .then(results => {
                    const feature = results.features[0].attributes.ObjectId;
                    layerView.highlight(feature);
                });
            })
        };
        const removeSiteHighlight = (layer, siteCode) => {
            const query = layer.current.createQuery();
            query.where = `StationCode = '${siteCode}'`;
            layer.current.queryFeatures(query)
            .then(results => {
                // Get Object ID of the feature to be removed
                const featureId = results.features[0].attributes.ObjectId;
                // Query to get the layer object, which contains a map of all highlighted features
                const layerId = selectedAnalyte ? 'station-summary-layer' : 'station-layer';
                const layer = viewRef.current.allLayerViews.items.filter(d => d.layer.id === layerId)[0];
                layer._highlightIds.delete(featureId);
                layer._updateHighlight();   
            });
        }
        if (viewRef.current) {
            const layer = selectedAnalyte ? stationSummaryLayerRef : stationLayerRef;
            viewRef.current.whenLayerView(layer.current).then((layerView) => {
                if (selectedSitesRef.current) {
                    const addedSites = selectedSites.filter(d => !selectedSitesRef.current.includes(d));
                    const removedSites = selectedSitesRef.current.filter(d => !selectedSites.includes(d));
                    if (addedSites.length > 0) { 
                        addSiteHighlight(layer, addedSites[0]); 
                    } else if (removedSites.length > 0) {
                        removeSiteHighlight(layer, removedSites[0]);
                    }
                    selectedSitesRef.current = selectedSites;
                } else {
                    addSiteHighlight(layer, selectedSites[0]);
                    selectedSitesRef.current = selectedSites;
                }
            })
        }
    }, [selectedSites])

    const initializeMap = () => {
        return new Promise((resolve, reject) => {
            loadModules([
                'esri/Map',
                'esri/views/MapView',
                'esri/widgets/Search',
                'esri/widgets/LayerList',
                'esri/widgets/Expand',
                'esri/widgets/Home'
            ]).then(([Map, MapView, Search, LayerList, Expand, Home]) => {
                mapRef.current = new Map({
                    basemap: 'topo-vector'
                });
                viewRef.current = new MapView({
                    container: divRef.current,
                    map: mapRef.current,
                    center: [-119.3624, 37.5048],
                    zoom: 6,
                    constraints: {
                        minZoom: 4
                    },
                    popup: {
                        dockOptions: {
                            buttonEnabled: false
                        },
                        collapseEnabled: false,
                    },
                    highlightOptions: {
                        fillOpacity: 0.2,
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
                layerListRef.current = new LayerList({
                    view: viewRef.current,
                    container: 'layerListContainer',
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
                /*
                expandRef.current = new Expand({
                    expandIconClass: 'esri-icon-layers',
                    view: viewRef.current,
                    content: layerListRef.current,
                    expanded: false
                })
                //viewRef.current.ui.add(searchRef.current, { position: 'top-right' });
                viewRef.current.ui.add(expandRef.current, 'bottom-left');
                */

                // Add Home widget
                const homeWidget = new Home({ view: viewRef.current });
                viewRef.current.ui.add(homeWidget, 'top-left');

                resolve();
            });
        })
    }

    const drawLandUse = () => {
        if (mapRef) {
            loadModules(['esri/layers/WMSLayer'])
            .then(([WMSLayer]) => {
                landUseLayerRef.current = new WMSLayer({
                    id: 'nlcd-layer',
                    title: 'National Land Cover Database 2016',
                    url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2016_Land_Cover_L48/wms?service=WMS&request=GetCapabilities',
                    sublayers: [{
                        name: 'NLCD_2016_Land_Cover_L48',
                        title: 'Land Cover',
                        legendUrl: 'https://www.mrlc.gov/geoserver/mrlc_display/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&WIDTH=12&HEIGHT=12&LAYER=NLCD_2016_Land_Cover_L48&legend_options=fontAntiAliasing:true;fontSize:8;dpi:100'
                    }],
                    copyright: 'MRLC NLCD',
                    listMode: 'hide-children',
                    opacity: 0.5,
                    visible: false
                });
                mapRef.current.add(landUseLayerRef.current);
            });
        }
    }

    const drawIntegratedReport = () => {
        const irTemplate = {
            // Must include these outfields here (and in the layer creator) for the content function to receive the feature attributes
            outFields: ['wbid', 'wbname', 'rb', 'wbtype', 'wb_category', 'wb_listingstatus', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_', 'fact_sheet'],
            title: '{wbname}<br><span class="map-popup-subtitle" style="color: #518f33">2018 Integrated Report</span>',
            content: [
                {
                    type: 'fields',
                    fieldInfos: [
                        {
                            fieldName: 'wbid',
                            label: 'ID',
                            visible: true
                        },
                        {
                            fieldName: 'wbtype',
                            label: 'Type',
                            visible: true
                        },
                        {
                            fieldName: 'rb',
                            label: 'Region',
                            visible: true
                        },
                        {
                            fieldName: 'wb_category',
                            label: 'Waterbody Condition Category',
                            visible: true
                        },
                        {
                            fieldName: 'wb_listingstatus',
                            label: 'Overall Listing Status',
                            visible: true
                        },
                        {
                            fieldName: 'listed_pollutants',
                            label: 'Listed Pollutant(s)',
                            visible: true
                        },
                        {
                            fieldName: 'listed_pollutant_w_tmdl',
                            label: 'Listed Pollutant(s) w TMDL',
                            visible: true
                        },
                        {
                            fieldName: 'listed_pollutant_addressed_by_n',
                            label: 'Listed Pollutant Addressed by NonTMDL',
                            visible: true
                        },
                        {
                            fieldName: 'listed_pollutant_addressed_by_n',
                            label: 'Listed Pollutant Addressed by NonTMDL',
                            visible: true
                        },
                        {
                            fieldName: 'listed_pollutant_addressed_by_n',
                            label: 'Listed Pollutant Addressed by NonTMDL',
                            visible: true
                        },
                        {
                            fieldName: 'pollutants_assessed_not_listed_',
                            label: 'Pollutants Assessed, Not Listed',
                            visible: true
                        },
                        {
                            fieldName: 'fact_sheet',
                            label: 'Waterbody Fact Sheet',
                            visible: true
                        }
                    ]
                }
            ]
        };
        if (mapRef) {
            loadModules(['esri/layers/FeatureLayer', 'esri/layers/GroupLayer'])
            .then(([FeatureLayer, GroupLayer]) => {
                irLineRef.current = new FeatureLayer({
                    id: 'ir-line-layer',
                    title: 'Integrated Report Lines 2018',
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/0',
                    outfields: ['wbid', 'wbname', 'est_size_a', 'size_assess', 'wbtype', 'rb', 'wb_category', 'wb_listingstatus', 'fact_sheet', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_'],
                    popupTemplate: irTemplate,
                    listMode: 'show',
                    renderer: irLineRenderer
                });
                irPolyRef.current = new FeatureLayer({
                    id: 'ir-poly-layer',
                    title: 'Integrated Report Polygons 2018',
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/1',
                    outfields: ['wbid', 'wbname', 'est_size_a', 'size_assess', 'wbtype', 'rb', 'wb_category', 'wb_listingstatus', 'fact_sheet', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_'],
                    popupTemplate: irTemplate,
                    renderer: irPolyRenderer,
                    listMode: 'show',
                    opacity: 0.8
                });
                irLayerRef.current = new GroupLayer({
                    id: 'ir-group-layer',
                    title: 'Integrated Report 2018',
                    visible: true,
                    layers: [irLineRef.current, irPolyRef.current],
                    listMode: 'show',
                    visibilityMode: 'inherited'
                });
                // Add grouplayer to map
                mapRef.current.add(irLayerRef.current);
                // Add feature layers to search widget
                searchRef.current.sources.add({
                    layer: irLineRef.current,
                    searchFields: ['wbid', 'wbname'],
                    displayField: 'wbname',
                    exactMatch: false,
                    outFields: ['wbname'],
                    name: 'Integrated Report Lines 2018',
                    placeholder: 'Example: Burney Creek'
                });
                searchRef.current.sources.add({
                    layer: irPolyRef.current,
                    searchFields: ['wbid', 'wbname'],
                    displayField: 'wbname',
                    exactMatch: false,
                    outFields: ['wbname'],
                    name: 'Integrated Report Polygons 2018',
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
                    id: 'basin-plan-layer',
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Basin_Plan/California_Basin_Plan_Beneficial_Uses/MapServer',
                    sublayers: [
                        {
                            id: 0, // polygon sublayer
                            title: 'Beneficial Uses - Polygons',
                            popupTemplate: bpPolyTemplate,  
                        },
                        {
                            id: 1, // line sublayer
                            title: 'Beneficial Uses - Lines',
                            popupTemplate: bpLineTemplate
                        }
                    ],
                    listMode: 'hide-children',
                    legendEnabled: true,
                    visible: false
                });
                mapRef.current.add(bpLayerRef.current);
            });
        }
    }

    const drawRegions = () => {
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
            });
        }
    }

    const buildStationPopup = (feature) => {
        let div = document.createElement('div');
        const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
        const formatDate = timeFormat('%m/%d/%Y');
        const attributes = feature.graphic.attributes;
        const stationCode = attributes['StationCode'];
        let url; 
        if (selectedAnalyte) {
            if (habitatAnalytes.includes(selectedAnalyte)) {
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=9ce012e2-5fd3-4372-a4dd-63294b0ce0f6&filters={%22StationCode%22:%22' + stationCode + '%22%2C%22Analyte%22:%22' + selectedAnalyte + '%22}&sort=%22SampleDate%22%20desc&limit=3';
            } else {
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&filters={%22StationCode%22:%22' + stationCode + '%22%2C%22Analyte%22:%22' + selectedAnalyte + '%22}&sort=%22SampleDate%22%20desc&limit=3';
            }
        } else {
            url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&filters={%22StationCode%22:%22' + stationCode + '%22}&sort=%22SampleDate%22%20desc&limit=3';
        }
        return fetch(url)
            .then(resp => resp.json())
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.SampleDate = parseDate(d.SampleDate);
                    d.Result = +d.Result.toFixed(2);
                    d.Unit = d.Unit === 'none' ? '' : d.Unit;
                });
                // Build popup content
                let content = '<span class="small">Latest results';
                if (selectedAnalyte) {
                    content += ' for ' + selectedAnalyte
                }
                content += ':</span><table class="popup-table"><colgroup><col span="1" style="width: 30%;"></col><col span="1" style="width: 35%;"></col><col span="1" style="width: 35%;"></col></colgroup><tbody>';
                for (let i = 0; i < records.length; i++) {
                    content += '<tr><td>' + formatDate(records[i]['SampleDate']) + '</td><td>' + records[i]['Analyte'] + '</td><td>' + records[i]['Result'] + ' ' + records[i]['Unit'] + '</td></tr>';
                }
                content += '</tbody></table>';
                content += '<div style="margin: 8px 0 2px 0"><a href="/explore_data/station/?q=' + stationCode + '" target="_blank" rel="noopener noreferrer" class="popup-button">View all station data</a></div>'
                div.innerHTML = content;
                return div;
            });
    }

    return (
        <div
            className={container}
            ref={divRef}
        />
    )
}