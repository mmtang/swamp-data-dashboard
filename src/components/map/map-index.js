import React, { useState, useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
import { timeParse, timeFormat } from 'd3';
import { regionDict, irRegionDict, stationRenderer, stationDataFields, stationDataTableFields, stationSummaryDataFields, stationSummaryTableFields } from '../../utils/utils';
import { container } from './map-index.module.css';


export default function MapIndex({ selectedAnalyte, selectedRegion, clickedSite, setSelectedSites, setTableData }) {
    const [sites, setSites] = useState([]);
    const featuresRef = useRef([]);

    const divRef = useRef(null);
    const mapRef = useRef(null);
    const viewRef = useRef(null);
    const searchRef = useRef(null);
    const expandRef = useRef(null);
    const landUseLayerRef = useRef(null);
    const irLayerRef = useRef(null);
    const irLineRef = useRef(null);
    const irPolyRef = useRef(null);
    const attainsLayerRef = useRef(null);
    const attainsLineRef = useRef(null);
    const attainsPolyRef = useRef(null);
    const bpLayerRef = useRef(null);
    const regionLayerRef = useRef(null);
    const stationLayerRef = useRef(null);
    const stationSummaryLayerRef = useRef(null);
    const layerListRef = useRef(null);
    const highlightRegionRef = useRef(null);
    const highlightSiteRef = useRef(null);
    const tableRef = useRef(null);

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
                        Trend: d.AllYears_Trend
                    }
                };
            });
            resolve(features);
        })
    }

    useEffect(() => {
        setSelectedSites(sites);
    }, [sites]);

    /*
    useEffect(() => {
        if (viewRef.current) {
            if (selectedAnalyte) {
                viewRef.current.whenLayerView(stationSummaryLayerRef.current).then(layerView => {
                    console.log('done');
                });
            } else {
                viewRef.current.whenLayerView(stationLayerRef.current).then(layerView => {
                    layerView.watch('updating', value => {
                        if (!value) {
                            layerView.queryFeatures({
                                geometry: viewRef.current,
                                returnGeometry: true
                            }).then(results => {
                                const features = results.features;
                                const featureData = features.map(d => {
                                    return {
                                        StationName: d.attributes.StationName,
                                        StationCode: d.attributes.StationCode,
                                        RegionName: d.attributes.RegionName,
                                        LastSampleDate: d.attributes.LastSampleDate
                                    }
                                })
                                console.log(featureData);
                                setTableData(featureData);
                            });
                        }
                    })
                })
            }
        }
    }, [selectedRegion, selectedAnalyte]);
    */

    useEffect(() => {
        const drawStations = () => {
            const stationTemplate = {
                title: '{StationName}<br><span class="map-popup-subtitle" style="color: #f15f2b">Monitoring station</span>',
                content: buildStationPopup
            };
            loadModules(['esri/layers/FeatureLayer', 'esri/widgets/FeatureTable', 'esri/core/watchUtils'])
                .then(([FeatureLayer, FeatureTable, watchUtils]) => {
                    if (mapRef) {
                        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude,Region,LastSampleDate&limit=5000';
                        fetch(url)
                        .then((resp) => resp.json())
                        .then((json) => json.result.records)
                        .then((records) => {
                            convertStationDataToGraphics(records)
                            .then(res => {
                                stationLayerRef.current = new FeatureLayer({
                                    id: 'stationLayer',
                                    objectIdField: 'ObjectId',
                                    title: 'SWAMP Monitoring Sites',
                                    source: res,
                                    fields: stationDataFields,
                                    outFields: ['*'],
                                    renderer: stationRenderer,
                                    popupTemplate: stationTemplate
                                });
                                mapRef.current.add(stationLayerRef.current);
                                /*
                                tableRef.current = new FeatureTable({
                                    view: viewRef.current, // The view property must be set for the select/highlight to work
                                    layer: stationLayerRef.current,
                                    fieldConfigs: stationDataTableFields,
                                    pageSize: 10,
                                    pagination: true,
                                    container: 'indexTableContainer',
                                    menuConfig: { // Creates a custom menu to zoom to selected features
                                        items: [{
                                            label: 'Zoom to feature(s)',
                                            iconClass: 'esri-icon-zoom-in-magnifying-glass',
                                            clickFunction: () => zoomToSelectedFeature()
                                        }]
                                    },
                                    gridOptions: {
                                        pagination: true
                                    }
                                });
                                // listen for selection changes
                                tableRef.current.on('selection-change', (changes) => {
                                    // If the selection is removed, remove the feature from the array
                                    changes.removed.forEach((item) => {
                                        // Update sites/features (for ArcGIS)
                                        featuresRef.current = featuresRef.current.filter(d => {
                                            return d.feature.attributes.StationCode !== item.feature.attributes.StationCode;
                                        });
                                        // Update array of sites
                                        setSites(sites => sites.filter(d => {
                                            return d !== item.feature.attributes.StationCode;
                                        }));
                                    });
                                    // If the selection is added, push all added selections to array
                                    changes.added.forEach((item) => {
                                        // Update sites/features for ArcGIS
                                        const feature = item.feature;
                                        featuresRef.current = [...featuresRef.current, { feature: feature }];
                                        // Update array of sites
                                        setSites(sites => [...sites, item.feature.attributes.StationCode]);
                                    });
                                });
                                // Listen for zooming/panning. Pass the new view.extent into the table's filterGeometry
                                stationLayerRef.current.watch('loaded', () => {
                                    watchUtils.whenFalse(viewRef.current, 'stationary', (event) => {
                                        if (!viewRef.current.stationary) {
                                            watchUtils.whenTrueOnce(viewRef.current, 'stationary', (event) => {
                                                // Get the new extent of view/map whenever map is updated.
                                                if (viewRef.current.extent) {
                                                    // Filter out and show only the visible features in the feature table
                                                    tableRef.current.filterGeometry = viewRef.current.extent;
                                                }
                                            });
                                        } else {
                                            watchUtils.whenFalseOnce(viewRef.current, 'interacting', (event) => {
                                                console.log(event);
                                            });
                                        }
                                    });
                                });
                                */

                                // Query features and then update table
                                updateTableWithStationData();
                                
                                // Add station data to search
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
                            });
                        });
                    }

                });
        };
        const zoomToSelectedFeature = () => {
            // Create a query off of the feature layer
            let activeLayer;
            const stationLayer = mapRef.current.allLayers.find((layer) => {
                return layer.id === 'stationLayer';
            });
            const summaryLayer = mapRef.current.allLayers.find((layer) => {
                return layer.id === 'stationSummaryLayer';
            });
            if (stationLayer) {
                activeLayer = stationLayerRef.current;
            } else if (summaryLayer) {
                activeLayer = stationSummaryLayerRef.current;
            }
            const query = activeLayer.createQuery();
            // Iterate through the features and grab the feature's objectID
            const featureIds = featuresRef.current.map((result) => {
                return result.feature.getAttribute(activeLayer.objectIdField);
            });
            // Set the query's objectId
            query.objectIds = featureIds;
            // Make sure to return the geometry to zoom to
            query.returnGeometry = true;
            // Call queryFeatures on the feature layer and zoom to the resulting features
            activeLayer.queryFeatures(query).then((results) => {
                if (query.objectIds.length > 1) {
                    // Zooming to the extent of multiple selected sites.
                    viewRef.current.goTo(results.features).catch((error) => {
                        if (error.name != 'AbortError') {
                            console.error(error);
                        }
                    });
                } else {
                    // Zooming to the extent of one selected site. The operation above does not handle single site selections well.
                    const feature = results.features[0];
                    viewRef.current.goTo({
                        target: feature.geometry,
                        zoom: 13
                    });
                }
            });
        }

        setDefaultOptions({ version: '4.20' });
        loadCss();
        initializeMap()
        .then(() => {
            drawLandUse();
            drawBasinPlan();
            //drawAttains();
            drawIntegratedReportLayers();
            drawRegions();
            drawStations();
        });
    }, [mapRef]);

    useEffect(() => {
        const updateStationAnalyteLayer = () => {
            if (stationSummaryLayerRef.current) {
                mapRef.current.remove(stationSummaryLayerRef.current);
                stationSummaryLayerRef.current = null;
                drawStationAnalyteLayer();
            }
        }
        const drawStationAnalyteLayer = () => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer', 'esri/symbols/CIMSymbol', 'esri/symbols/support/cimSymbolUtils'])
                .then(([FeatureLayer, CIMSymbol, cimSymbolUtils]) => {
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
                    cimSymbolUtils.applyCIMSymbolRotation(arrowDecreasing, 180)
                    const noTrendSym = {
                        type: 'simple-marker',
                        size: 6,
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
                                value: 'Not assessed',
                                symbol: notAssessedSym
                            }
                        ]
                    };
                    const analyteTemplate = {
                        title: '{StationName}<br><span class="map-popup-subtitle" style="color: #f15f2b">Monitoring station</span>',
                        content: buildStationPopup
                    }
                    let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude,Analyte,LastSampleDate,Region,AllYears_Trend&limit=5000';
                    url += '&filters={%22Analyte%22:%22' + encodeURIComponent(selectedAnalyte) + '%22}'
                    fetch(url)
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        convertStationSummaryDataToGraphics(records)
                        .then(res => {
                            stationSummaryLayerRef.current = new FeatureLayer({
                                id: 'stationSummaryLayer',
                                objectIdField: 'ObjectId',
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

                            // Change table data source
                            /*
                            tableRef.current.layer = stationSummaryLayerRef.current;
                            tableRef.current.fieldConfigs = stationSummaryTableFields;
                            */
                        })
                    });
                });
            }
        }
        if (mapRef.current) {
            if (selectedAnalyte) {
                mapRef.current.remove(stationLayerRef.current);
                if (!stationSummaryLayerRef.current) {
                    drawStationAnalyteLayer();
                } else {
                    updateStationAnalyteLayer();
                }
            } else {
                //tableRef.current.clearSelection();
                mapRef.current.remove(stationSummaryLayerRef.current);
                mapRef.current.add(stationLayerRef.current);
                // Update table
                updateTableWithStationData();
                //tableRef.current.layer = stationLayerRef.current;
                //tableRef.current.fieldConfigs = stationDataTableFields;
            }
        }
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

    useEffect(() => {
        if (mapRef.current) {
            const bpPolys = bpLayerRef.current.findSublayerById(0);
            const bpLines = bpLayerRef.current.findSublayerById(1);
            if (selectedRegion) {
                // Filter IR Layers
                irLineRef.current.definitionExpression = `rb = '${irRegionDict[selectedRegion]}'`;
                irPolyRef.current.definitionExpression = `rb = '${irRegionDict[selectedRegion]}'`
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
                // Filter BPMP
                bpPolys.definitionExpression = `BASINPLANNAME = '${selectedRegion}'`;
                bpLines.definitionExpression = `BASINPLANNAME = '${selectedRegion}'`;
                // Highlight region
                loadModules(['esri/views/layers/LayerView', 'esri/rest/support/Query'])
                .then(([LayerView, Query]) => {
                    if (viewRef.current) {
                        viewRef.current.whenLayerView(regionLayerRef.current).then((layerView) => {
                            // if a feature is already highlighted, then remove the highlight
                            if (highlightRegionRef.current) {
                                highlightRegionRef.current.remove();
                            }
                            const query = regionLayerRef.current.createQuery();
                            query.where = `rb_name = '${selectedRegion}'`;
                            regionLayerRef.current.queryFeatures(query).then(results => {
                                const feature = results.features[0];
                                viewRef.current.goTo(feature.geometry);
                                // set the highlight on the first feature returned by the query
                                highlightRegionRef.current = layerView.highlight(feature);
                            })
                        })
                    }
                });
            } else {
                // Unfilter stations
                if (stationLayerRef.current) {
                    stationLayerRef.current.definitionExpression = '';
                    updateTableWithStationData();
                }
                if (stationSummaryLayerRef.current) {
                    stationSummaryLayerRef.current.definitionExpression = '';
                    updateTableWithStationSummaryData();
                }
                // Unfilter IR Layers
                irLineRef.current.definitionExpression = '';
                irPolyRef.current.definitionExpression = '';
                // Unfilter BPMP
                bpPolys.definitionExpression = "BASINPLANNAME = ''";
                bpLines.definitionExpression = "BASINPLANNAME = ''";
                // Remove region highlight
                if (highlightRegionRef.current) {
                    highlightRegionRef.current.remove();
                }
            }
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (viewRef.current) {
            if (clickedSite) {
                loadModules(['esri/views/layers/LayerView','esri/tasks/support/Query'])
                .then(([LayerView, Query]) => {
                    const layer = selectedAnalyte ? stationSummaryLayerRef : stationLayerRef;
                    viewRef.current.whenLayerView(layer.current).then((layerView) => {
                        // if a site is already highlighted, then remove the highlight
                        if (highlightSiteRef.current) {
                            highlightSiteRef.current.remove();
                        }
                        const query = layer.current.createQuery();
                        query.where = `StationCode = '${clickedSite.StationCode}'`;
                        layer.current.queryFeatures(query)
                            .then(results => {
                                const feature = results.features[0];
                                viewRef.current.goTo({
                                    target: feature.geometry,
                                    zoom: 13
                                });
                                highlightSiteRef.current = layerView.highlight(feature);
                            })
                    })
                })
            }
        }
    }, [clickedSite, selectedAnalyte])

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
                    popup: {
                        dockOptions: {
                            buttonEnabled: false
                        },
                        collapseEnabled: false,
                    },
                    highlightOptions: {
                        fillOpacity: 0.1
                    }
                });
                searchRef.current = new Search({
                    view: viewRef.current,
                    container: 'searchContainer',
                    allPlaceholder: 'Zoom to a location, waterbody, or monitoring site',
                    label: 'Zoom to a location, waterbody, or monitoring site',
                    includeDefaultSources: true,
                    locationEnabled: false,
                    popupEnabled: false,
                    autoSelect: true,
                    sources: []
                });
                layerListRef.current = new LayerList({
                    view: viewRef.current,
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
                expandRef.current = new Expand({
                    expandIconClass: 'esri-icon-layers',
                    view: viewRef.current,
                    content: layerListRef.current,
                    expanded: false
                })
                //viewRef.current.ui.add(searchRef.current, { position: 'top-right' });
                viewRef.current.ui.add(expandRef.current, 'bottom-left');

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
                    id: 'nlcdLayer',
                    title: 'National Land Cover Database (2016)',
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

    const drawIntegratedReportLayers = () => {
        const irLineRenderer = {
            type: 'unique-value',
            field: 'wb_listingstatus',
            defaultSymbol: { type: 'simple-line' },
            uniqueValueInfos: [
                {
                    value: 'Listed',
                    symbol: {
                        type: 'simple-line',
                        color: '#518f33',
                        width: '2px'
                    }
                },
                {
                    value: 'Not Listed',
                    symbol: {
                        type: 'simple-line',
                        color: '#8db933',
                        width: '2px'
                    }
                }   
            ]
        }
        const irPolyRenderer = {
            type: 'unique-value',
            field: 'wb_listingstatus',
            defaultSymbol: { type: 'simple-fill' },
            uniqueValueInfos: [
                {
                    value: 'Listed',
                    symbol: {
                        type: 'simple-fill',
                        color: '#518f33',
                        outline: {
                            color: '#518f33'
                        }
                    }
                },
                {
                    value: 'Not Listed',
                    symbol: {
                        type: 'simple-fill',
                        color: '#8db933',
                        outline: {
                            color: '#8db933'
                        }
                    }
                }
            ]
        }
        const irTemplate = {
            // Must include these outfields here (and in the layer creator) for the content function to receive the feature attributes
            outFields: ['wbid', 'wbname', 'rb', 'wbtype', 'wb_category', 'wb_listingstatus', 'listed_pollutants', 'fact_sheet'],
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
                    id: 'irLines',
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/0',
                    outfields: ['wbid', 'wbname', 'est_size_a', 'size_assess', 'wbtype', 'rb', 'wb_category', 'wb_listingstatus', 'fact_sheet', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_'],
                    popupTemplate: irTemplate,
                    listMode: 'show',
                    renderer: irLineRenderer
                });
                irPolyRef.current = new FeatureLayer({
                    id: 'irPolys',
                    url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/1',
                    outfields: ['wbid', 'wbname', 'est_size_a', 'size_assess', 'wbtype', 'rb', 'wb_category', 'wb_listingstatus', 'fact_sheet', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_'],
                    popupTemplate: irTemplate,
                    renderer: irPolyRenderer,
                    listMode: 'show',
                    opacity: 0.8
                });
                irLayerRef.current = new GroupLayer({
                    title: '2018 Integrated Report',
                    visible: true,
                    layers: [irLineRef.current, irPolyRef.current],
                    listMode: 'show'
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
                    name: '2018 Integrated Report - Lines',
                    placeholder: 'Example: Burney Creek'
                });
                searchRef.current.sources.add({
                    layer: irPolyRef.current,
                    searchFields: ['wbid', 'wbname'],
                    displayField: 'wbname',
                    exactMatch: false,
                    outFields: ['wbname'],
                    name: '2018 Integrated Report - Polygons',
                    placeholder: 'Example: Folsom Lake'
                });
            });
        }
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
            loadModules(['esri/layers/FeatureLayer', 'esri/layers/GroupLayer'])
            .then(([FeatureLayer, GroupLayer]) => {
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
                attainsLayerRef.current = new GroupLayer({
                    title: 'ATTAINS Assessment',
                    visible: false,
                    visibilityMode: 'inherited',
                    layers: [attainsLineRef.current, attainsPolyRef.current],
                });
                // Add grouplayer to map
                mapRef.current.add(attainsLayerRef.current);
                // Add feature layers to search widget
                searchRef.current.sources.add({
                    layer: attainsLineRef.current,
                    searchFields: ['assessmentunitname'],
                    displayField: 'assessmentunitname',
                    exactMatch: false,
                    outFields: ['assessmentunitname'],
                    name: 'ATTAINS Assessment - Lines',
                    placeholder: 'Example: Burney Creek'
                });
                searchRef.current.sources.add({
                    layer: attainsPolyRef.current,
                    searchFields: ['assessmentunitname'],
                    displayField: 'assessmentunitname',
                    exactMatch: false,
                    outFields: ['assessmentunitname'],
                    name: 'ATTAINS Assessment - Areas',
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
        const regionRenderer = {
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
                regionLayerRef.current = new FeatureLayer({
                    id: 'regionLayer',
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
            url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&filters={%22StationCode%22:%22' + stationCode + '%22%2C%22Analyte%22:%22' + selectedAnalyte + '%22}&sort=%22SampleDate%22%20desc&limit=3';
        } else {
            url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&filters={%22StationCode%22:%22' + stationCode + '%22}&sort=%22SampleDate%22%20desc&limit=3';
        }
        return fetch(url)
            .then(resp => resp.json())
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.SampleDate = parseDate(d.SampleDate);
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