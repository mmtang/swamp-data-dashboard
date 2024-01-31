import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
import MapLegend from './map-legend';

// Load helper functions and constants
import { 
    bioassessmentStationRenderer,
    bpLineRenderer, 
    bpPolyRenderer, 
    irLineRenderer2020, 
    irPolyRenderer2020, 
    regionRenderer, 
    stationRenderer 
} from './map-renderer';

import { 
    bpLayerDict, 
    convertStationDataToGraphics, 
    stationDataFields 
} from '../../utils/utils-map';

import { 
    irRegionDict, 
    regionDict, 
    regionNumDict 
} from '../../utils/utils';

// Load styles
import { container, mapLegendContainer } from './map-index2.module.css';

export default function MapIndex2({ 
    comparisonSites,
    filterByMapExtent,
    highlightReferenceSites,
    mapLoaded,
    region,
    selecting,
    setComparisonSites,
    setHighlightReferenceSites,
    setMapLoaded, 
    setMessageModal,
    setMessageModalVisible,
    setSelecting,
    setStation,
    setStationLoading,
    setTableData,
    setZoomToStation,
    station,
    stationData,
    zoomToStation
}) {
    // Declare component references
    const basemapGalleryRef = useRef(null);
    const bpLayerRef = useRef(null); // The main Basin Plan group layer ref used for all regions
    const bpLayer2Ref = useRef(null); // Used only for R5, which has two Basin Plan layers/datasets
    const comparisonSitesRef = useRef(null); // Used to store the old array of site code strings. Will be compared to the new array
    const divRef = useRef(null); // Map container
    const expandGalleryRef = useRef(null); // Used for basemap gallery
    // IR Sublayers - Need to have separate refs for both layers because the features in each layer will be filtered by region based on user selection. The refs are needed to change the layer's definition expression
    const irLayer2020Ref = useRef(null);
    const irLine2020Ref = useRef(null);
    const irPoly2020Ref = useRef(null);
    const landUseLayerRef = useRef(null);
    const layerListRef = useRef(null);
    const listenerRef = useRef(null); // Used for keeping track of selection modes, example: user selecting comparison sites
    const listenerFilterRef = useRef(null); // Used for storing the filter by extent listener
    const mapRef = useRef(null);
    const regionLayerRef = useRef(null);
    const searchRef = useRef(null);
    const stationLayerRef = useRef(null);
    const viewRef = useRef(null);

    // This function fetches and renders the region layer service
    // This layer is immediately added to the map, unlike other layers on the map, because the region values are used very early on during initialization of the component
    const drawRegions = () => {
        return new Promise((resolve, reject) => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer'])
                .then(([FeatureLayer]) => {
                    // Initialize layer
                    regionLayerRef.current = new FeatureLayer({
                        id: 'region-layer',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Regional_Board_Boundary_Features/FeatureServer/1',
                        // listMode: With this option, the layer is not shown in layer legend/list, and therefore the user cannot change the visibility of the layer. Better to always show it because there are many filters being applied on a region by region basis. Can always make this layer "toggleable" in the future if there is feedback requesting it
                        listMode: 'hide', 
                        renderer: regionRenderer
                    });
                    // Add to map instance
                    mapRef.current.add(regionLayerRef.current);
                    // Zoom to region if a region is pre-selected (url params used)
                    if (region) {
                        zoomToRegion(regionDict[region]);
                        // viewRef.current.center = [-119.3624, 37.4204]
                    }
                    resolve();
                });
            }
        })
    }

    // This function fetches the Integrated Report layer services for polys and lines and stores both in a group layer object. The IR features are visible on the map upon initial load
    const drawIntegratedReport = () => {
        const irTemplate2020 = {
            // Must include these outfields here (and in the layer creator) for the content function to receive the feature attributes
            outFields: ['waterbody_id', 'waterbody_name', 'regional_board', 'waterbody_type', 'waterbody_category', 'listing_status', 'pollutants_listed', 'fact_sheet', 'wb_size', 'waterbody_counties'],
            title: '<div style="padding: 4px 0"><span style="font-size: 1.05em; color: #ffffff">{waterbody_name}</span></div>',
            content: [
                {
                    type: 'fields',
                    fieldInfos: [
                        {
                            fieldName: 'waterbody_id',
                            label: 'ID',
                            visible: true
                        },
                        {
                            fieldName: 'waterbody_type',
                            label: 'Type',
                            visible: true
                        },
                        {
                            fieldName: 'regional_board',
                            label: 'Region',
                            visible: true
                        },
                        {
                            fieldName: 'waterbody_category',
                            label: 'Waterbody Category',
                            visible: true
                        },
                        {
                            fieldName: 'wb_size',
                            label: 'Size (miles)',
                            visible: true
                        },
                        {
                            fieldName: 'listing_status',
                            label: 'Listing Status',
                            visible: true
                        },
                        {
                            fieldName: 'pollutants_listed',
                            label: 'Pollutants Listed',
                            visible: true
                        },
                        {
                            fieldName: 'fact_sheet',
                            label: 'Fact Sheet',
                            visible: true
                        }
                    ]
                }
            ]
        };
        return new Promise((resolve, reject) => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer', 'esri/layers/GroupLayer'])
                .then(([FeatureLayer, GroupLayer]) => {
                    // 2020 IR Layer
                    irLine2020Ref.current = new FeatureLayer({
                        id: 'ir-line-layer-2020',
                        title: 'Streams, Rivers, Beaches',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Lines/FeatureServer/0',
                        outfields: ['waterbody_id', 'waterbody_name', 'waterbody_counties', 'wb_size', 'waterbody_type', 'regional_board', 'wb_category', 'listing_status', 'fact_sheet', 'pollutants_listed'],
                        listMode: 'hide',
                        popupTemplate: irTemplate2020,
                        renderer: irLineRenderer2020
                    });
                    irPoly2020Ref.current = new FeatureLayer({
                        id: 'ir-poly-layer-2020',
                        title: 'Lakes, Bays, Reservoirs',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Polys/FeatureServer/0',
                        outfields: ['waterbody_id', 'waterbody_name', 'waterbody_counties', 'wb_size', 'waterbody_type', 'regional_board', 'wb_category', 'listing_status', 'fact_sheet', 'pollutants_listed'],
                        listMode: 'hide',
                        opacity: 0.8,
                        popupTemplate: irTemplate2020,
                        renderer: irPolyRenderer2020
                    });
                    irLayer2020Ref.current = new GroupLayer({
                        id: 'ir-group-layer-2020',
                        title: '2020-2022 Integrated Report',
                        visible: false,
                        layers: [irLine2020Ref.current, irPoly2020Ref.current],
                        listMode: 'show',
                        visibilityMode: 'inherited'
                    });
                    resolve();
                });
            }
        })
    }

    // This function fetches the 2019 NLCD service and stores it in a WMSLayer object. It is toggled off by default
    const drawLandUse = () => {
        return new Promise((resolve, reject) => {
            if (mapRef) {
                loadModules(['esri/layers/WMSLayer'])
                .then(([WMSLayer]) => {
                    landUseLayerRef.current = new WMSLayer({
                        id: 'nlcd-layer',
                        title: 'National Land Cover Database 2019',
                        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2019_Land_Cover_L48/wms?service=WMS&request=GetCapabilities',
                        sublayers: [{
                            name: 'NLCD_2019_Land_Cover_L48',
                            title: 'Land Cover',
                            // Legend image is fetched on the fly and generated by the mrlc server
                            legendUrl: 'https://www.mrlc.gov/geoserver/mrlc_display/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&WIDTH=12&HEIGHT=12&LAYER=NLCD_2019_Land_Cover_L48&legend_options=fontAntiAliasing:true;fontSize:8;dpi:100'
                        }],
                        copyright: 'MRLC NLCD',
                        listMode: 'hide-children',
                        opacity: 0.5,
                        visible: false
                    });
                    resolve();
                });
            }
        })
    };

    // Refreshes the Integrated Report layers based on user selection. The IR layers are filtered using definition expressions
    const refreshIntegratedReport = () => {
        const constructDefExp = () => {
            if (region) {
                return `regional_board = '${irRegionDict[regionDict[region]]}'`;
            } else if (!region) {
                return '';
            }
        }
        if (mapRef.current) {
            // Update filters
            irLine2020Ref.current.definitionExpression = constructDefExp();
            irPoly2020Ref.current.definitionExpression = constructDefExp();
        }
    }

    // Process station data and define station layer
    const drawStationLayer = () => {
        return new Promise((resolve, reject) => {
            const stationTemplate = {
                title: '<div style="background-color: ##2b2b2b; color: #fff; text-align: center">{StationName}</div>'
            };
            loadModules(['esri/layers/FeatureLayer'])
            .then(([FeatureLayer]) => {
                if (mapRef) {
                    // Convert json data from the open data portal to ArcGIS graphic structure
                    convertStationDataToGraphics(stationData)
                    .then(res => {
                        // Define layer
                        stationLayerRef.current = new FeatureLayer({
                            id: 'station-layer',
                            objectIdField: 'ObjectId',
                            geometryType: 'point',
                            spatialReference: 3857,
                            title: 'SWAMP Stations',
                            source: res,
                            fields: stationDataFields,
                            outFields: ['*'],
                            renderer: highlightReferenceSites ? bioassessmentStationRenderer : stationRenderer,
                            popupTemplate: stationTemplate
                        })
                        resolve();
                    });
                } else {
                    console.error('Missing map object')
                }
            });
        })
    };

    const setRenderer = (layer, renderer) => {
        if (layer && renderer) {
            layer.renderer = renderer;
        }
    };

    /* This function is for generating station popups on hover
    Not using since 2/17/23 - Issue with the functions in this listener closing the popups of the other layers (IR, BP) on cursor movement. If there is a way to stop it from doing this, then will reinstate, but I have not found a way yet. The alternative (no mouseover popups, all persistent popups) is better than keeping this. The issue is rooted in how ArcGIS JS implements popups - one popup per view only.
    const addStationPopupListener = () => {
        loadModules(['esri/core/promiseUtils'])
            .then(([promiseUtils]) => {
                // Add event listener for popup on hover
                // https://codepen.io/laurenb14/pen/YzargEx?editors=1000
                viewRef.current.whenLayerView(stationLayerRef.current).then((layerView) => {
                    let highlight;
                    let objectId;
                    // Use the promiseUtils.debounce method to ensure the pointer-move event
                    // is not simultaneously invoked more than once at a time
                    const debouncedUpdate = promiseUtils.debounce((event) => {
                        // Set the options to only include hitTest results from feature layer
                        const opts = {
                            include: [stationLayerRef.current, irPoly2020Ref.current]
                        }
                        // Perform a hitTest on the View
                        viewRef.current.hitTest(event, opts).then((event) => {
                            console.log(event);
                            if (event.results.length > 0) {
                                // Make sure graphic has a popupTemplate
                                const results = event.results.filter((result) => {
                                    return result.graphic.layer.popupTemplate;
                                });
                                const result = results[0];
                                const newObjectId =
                                    result && result.graphic.attributes[stationLayerRef.current.objectIdField];
                                if (!newObjectId) {
                                    highlight && highlight.remove();
                                } else if (objectId !== newObjectId) {
                                    highlight && highlight.remove();
                                    objectId = newObjectId;
                                    highlight = layerView.highlight(result.graphic);
                                    viewRef.current.popup.features = [result.graphic];
                                    // set the location of the popup - using the geometry of the event result
                                    viewRef.current.popup.location = {
                                        latitude: result.graphic.geometry.latitude,
                                        longitude: result.graphic.geometry.longitude
                                    };
                                    if (!viewRef.current.popup.visible) {
                                        viewRef.current.popup.visible = true;
                                    }
                                }
                            } else {
                                viewRef.current.popup.visible = false;
                                highlight && highlight.remove();
                                objectId = null;
                            }
                        });
                    });
                    // Listen for the pointer-move event on the View
                    // and make sure that function is not invoked more
                    // than one at a time
                    viewRef.current.on('pointer-move', (event) => {
                        debouncedUpdate(event).catch((err) => {
                            if (!promiseUtils.isAbortError(err)) {
                                throw err;
                            }
                        });
                    });
                });
            });
    }
    */

    // This function updates the SWAMP station layer 
    // Updating layer data without flicker effect: https://community.esri.com/t5/arcgis-api-for-javascript-questions/is-there-a-way-to-load-update-the-data-without/td-p/251114
    const refreshStationLayer = async (data) => {
        // Query current features
        const currentFeatures = await stationLayerRef.current.queryFeatures();
        // Convert new station data to graphics
        const newFeatures = await convertStationDataToGraphics(data);
        // It is possible to combine both deleteFeatures and addFeatures into one applyEdits function (as in the community.esri.com link), but this causes some unattractive flickering on the map as the stations rerender. I prefer deleting the features first and then adding the new features in successive order
        stationLayerRef.current.applyEdits({
            deleteFeatures: currentFeatures.features, // delete the old features
        }).then((results) => {
            setTimeout(() => {
                stationLayerRef.current.applyEdits({
                    addFeatures: newFeatures,
                });
                setTimeout(() => {
                    if (filterByMapExtent) {
                        filterTableDataByExtent()
                    } else {
                        unfilterTableData();
                    }
                    setMapLoaded(true);
                }, 1000)
            }, 100); // Set timeout to prevent flashing on the map. I picked 100ms because this timing seems to work well with the map's loading indicator (automatically generated)
        });
    }

    // Initialize the map object and accompanying objects
    const initializeMap = () => {
        return new Promise((resolve, reject) => {
            loadModules([
                'esri/widgets/BasemapGallery',
                'esri/widgets/Expand',
                'esri/widgets/Home',
                'esri/widgets/LayerList',
                'esri/Map',
                'esri/views/MapView',
                'esri/widgets/Search'
            ]).then(([BasemapGallery, Expand, Home, LayerList, Map, MapView, Search]) => {
                // Define map
                mapRef.current = new Map({
                    // List of basemap ids: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
                    basemap: 'topo-vector' // topo-vector does not require API authentification
                });
                // Define map view
                viewRef.current = new MapView({
                    container: divRef.current,
                    map: mapRef.current,
                    center: [-119.3624, 37.4204], // centered California for initial load
                    zoom: 6, 
                    constraints: {
                        minZoom: 5
                    },
                    popup: {
                        dockOptions: {
                            buttonEnabled: false
                        },
                        collapseEnabled: false,
                    }
                });

                // Define search widget
                searchRef.current = new Search({
                    view: viewRef.current,
                    container: 'searchContainer',
                    // allPlaceholder: 'Find a station, waterbody',
                    allPlaceholder: '',
                    includeDefaultSources: false, // default sources include ArcGIS world geocoding service
                    locationEnabled: false, // pinpoint user location using browser
                    popupEnabled: false,
                    autoSelect: true,
                });
                // Define layer list widget
                layerListRef.current = new LayerList({
                    view: viewRef.current,
                    container: 'map-legend-container', // external div, outside of component
                    listItemCreatedFunction: function(event) {
                        const item = event.item;
                        // keep for reference
                        // if (item.layer.type !== 'group') {
                          // don't show legend twice
                          item.panel = {
                            content: 'legend',
                            open: true
                          };
                        //}
                    }
                });
                // Define basemap gallery widget
                // List of basemap ids: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
                basemapGalleryRef.current = new BasemapGallery({
                    view: viewRef.current
                });
                // Define expand widget for basemap gallery
                expandGalleryRef.current = new Expand({
                    expandIconClass: 'esri-icon-basemap', // icons: https://developers.arcgis.com/javascript/latest/esri-icon-font/
                    view: viewRef.current,
                    content: basemapGalleryRef.current,
                    expanded: false
                })
                // Add expand widget, used for the basemap gallery
                viewRef.current.ui.add(expandGalleryRef.current, 'top-left');
                // Add Home widget, clicking on it will return to statewide view
                const homeWidget = new Home({ view: viewRef.current });
                viewRef.current.ui.add(homeWidget, 'top-left');
                resolve();
            });
        })
    }

    // Initial load; see other useEffect for updating the station layer
    useEffect(() => {
        if (!mapRef.current && stationData) {
            setDefaultOptions({ version: '4.25' });
            loadCss();
            initializeMap().then(() => {
                Promise.all([
                    drawStationLayer(),
                    drawRegions(),
                    drawIntegratedReport(),
                    drawLandUse()
                ]).then(values => {
                    // If a station has been pre-selected (url params), then zoom to station
                    if (station) {
                        goToStation(station.StationCode);
                    };
                    // Add layers in order
                    mapRef.current.addMany([
                        landUseLayerRef.current, 
                        irLayer2020Ref.current,
                        stationLayerRef.current
                    ]);
                    // addStationPopupListener();
                    // Initialize search sources
                    //filterTableDataByExtent(); // Populate station main table
                    resetSearchSources(); 
                    refreshIntegratedReport();
                    setMapLoaded(true);
                });
            });
        }
    }, [stationData])

    // This useEffect controls the type of code that runs when a station on the map is clicked.
    // The behavior changes based on whether or not the user is adding comparison sites or not.
    // Because of the way ArcGIS JS works, we have to remove and initialize a new listener every time this changes
    useEffect(() => {
        if (viewRef.current) {
            if (selecting) {
                if (listenerRef.current) { 
                    listenerRef.current.remove();
                };
                // Add listener for adding to the comparison site list when map is clicked
                listenerRef.current = viewRef.current.on('click', function(evt) {  
                    // Search for symbols on click's position
                    viewRef.current.hitTest(evt.screenPoint)
                        .then(function(response) {
                            // Retrieve the first symbol
                            var graphic = response.results[0].graphic;
                            // Clicking on an empty part of the map still returns an object with attributes (ID). Check for a station attribute
                            if (graphic.attributes.StationCode) {
                                addToComparisonList(graphic.attributes);
                                // Reset the selecting state; this resets the selecting button after the user clicks a station
                                setSelecting(false);
                            }
                        });
                }); 
            } else {
                if (listenerRef.current) { 
                    listenerRef.current.remove();
                };
                // Add listener for changing the selected site when a site is clicked on the map
                // https://gis.stackexchange.com/questions/223785/cannot-catch-click-event-on-featurelayer-in-arcgis-api-for-javascript-4
                listenerRef.current = viewRef.current.on('click', function(evt) {  
                    // Search for symbols on click's position
                    viewRef.current.hitTest(evt.screenPoint)
                        .then(function(response) {
                            // Retrieve the first symbol
                            var graphic = response.results[0].graphic;
                            // Clicking on an empty part of the map still returns an object with attributes (ID). Check for a station attribute
                            if (graphic.attributes.StationCode) {
                                //addToSelectedList({ code: graphic.attributes.StationCode, name: graphic.attributes.StationName });
                                setStationLoading(true);
                                setStation(graphic.attributes);
                            }
                        });
                }); 
            }
        }
    }, [selecting]);

    useEffect(() => {
        // Initialize click listener: default behavior is to change the selected station when the user clicks on a station on the map
        // This click event behavior will change when the user is selecting comparison sites. The other useEffect function controls this.
        // Do not add a click listener when the station layer is created. There are some scope issues. The listener cannot access the current state when it changes.
        if (viewRef.current) {
            listenerRef.current = viewRef.current.on('click', function(evt) {  
                // Search for symbols on click's position
                viewRef.current.hitTest(evt.screenPoint)
                    .then(function(response) {
                        // Retrieve the first symbol
                        var graphic = response.results[0].graphic;
                        // Clicking on an empty part of the map still returns an object with attributes (ID). Check for a station attribute
                        if (graphic.attributes.StationCode) {
                            //addToSelectedList({ code: graphic.attributes.StationCode, name: graphic.attributes.StationName });
                            setStationLoading(true);
                            setStation(graphic.attributes);
                        }
                    });
            }); 
        }
    }, [viewRef.current])

    // Update the ref value everytime comparisonSites changes. 
    // The function, addToComparisonList cannot read from the updated comparisonList state, so we must store the updated value in the ref every time the state changes
    useEffect(() => {
        comparisonSitesRef.current = comparisonSites;
    }, [comparisonSites]);

    // This function checks if a station is already in the comparison sites array. If it does not already exist, then it adds the new value to the state array. This runs when a station on the map is clicked and the selecting mode is on (true)
    const addToComparisonList = (stationObj) => {
        if (stationObj) {
            // Check that the clicked site isn't the same as the currently selected site
            if (stationObj.StationCode !== station.StationCode) {
                // Check if site has already been selected. If not already selected (indexOf === -1), add to existing array
                // Use the ref value here, not the state, because this function cannot get the updated state. There is a useEffect function that updates the ref value whenever state changes
                const selectedCodes = comparisonSitesRef.current.map(d => d.StationCode);
                // Check if the value already exists in the array
                if (selectedCodes.indexOf(stationObj.StationCode) === -1) {
                    const newObj = {
                        StationCode: stationObj.StationCode,
                        StationName: stationObj.StationName
                    }
                    setComparisonSites(comparisonSites => [...comparisonSites, newObj]);
                } else {
                    setMessageModal(`${stationObj.StationCode} has already been selected. Try adding another station.`);
                    setMessageModalVisible(true);
                }
            } else {
                setMessageModal(`${stationObj.StationCode} is the currently selected station. Try adding another station.`);
                setMessageModalVisible(true);
            }
        }
    }

    useEffect(() => {
        if (stationLayerRef.current) {
            refreshStationLayer(stationData);
        }
    }, [stationData]);

    useEffect(() => {
        if (filterByMapExtent === true) {
            filterTableDataByExtent();
            addFilterListener();
        } else {
            // Remove existing listener, if it exists
            if (listenerFilterRef.current) { 
                listenerFilterRef.current.remove();
            }
            unfilterTableData();
        }
    }, [filterByMapExtent]);

    // Adds a listener to a the map that fires every time the map extent changes
    const addFilterListener = () => {
        loadModules([
            'esri/core/reactiveUtils',
        ]).then(([reactiveUtils]) => {
            listenerFilterRef.current = reactiveUtils.watch(
                // getValue function
                () => viewRef.current.updating === false,
                // callback
                (updating) => {
                    filterTableDataByExtent();
                }
            );
        });
    }

    // Query features from the current map extent and set as the new table data
    const filterTableDataByExtent = () => {
        stationLayerRef.current.queryFeatures({
            geometry: viewRef.current.extent
        }).then(results => {
            // Get feature attributes
            const features = results.features;
            const featureData = features.map(d => d.attributes);
            setTableData(featureData);
        });
    }

    // Query all features from the station layer and set as the new table data
    const unfilterTableData = async () => {
        if (stationLayerRef.current) {
            stationLayerRef.current.queryFeatures()
            .then((results) => {
                const features = results.features;
                const featureData = features.map(d => d.attributes);
                setTableData(featureData);
            });
        }
    }

    // Used to load initial dataset into main table
    useEffect(() => {
        if (viewRef.current) {
            unfilterTableData();
        }
    }, [stationLayerRef.current]);

    /*
    // Listener for filtering table automatically on map extent change - updating station list
    // Watchutils is deprecated
    useEffect(() => {
        if (viewRef.current && stationLayerRef.current) {
            viewRef.current.whenLayerView(stationLayerRef.current).then(layerView => {
                layerView.watch('updating', function(value) {
                    if (!value) {
                        // Query features in the current map extent
                        layerView.queryFeatures({
                            geometry: viewRef.current.extent
                        }).then(results => {
                            // Get feature attributes
                            const features = results.features;
                            const featureData = features.map(d => d.attributes);
                            setTableData(featureData);
                        })
                    }
                })
            })
        }
    }, [stationLayerRef.current]);
    */

    const goToStation = (stationCode) => {
        if (stationLayerRef.current && stationCode) {
            const layer = stationLayerRef.current;
            // Query features from the layer and then get the Object ID for features that match the selected station code
            const query = layer.createQuery();
            layer.queryFeatures(query).then(response => {
                const features = response.features;
                const matches = features.filter(d => d.attributes.StationCode === stationCode);
                const featureId = matches.map(d => d.attributes.ObjectId);
                // Set the query's objectId
                query.objectIds = featureId;
                // Must get the geometry to be able to determine the extent and zoom
                query.returnGeometry = true;
                // Run query
                layer.queryFeatures(query).then((results) => {
                    // Zoom to the matched result, there shouldn't be more than one result
                    const feature = results.features[0];
                    viewRef.current.goTo({
                        target: feature.geometry,
                        zoom: 13
                    });
                });
            });
        }
        
    }

    // Zoom to the selected station on the map
    useEffect(() => {
        if (zoomToStation) {
            const stationCode = zoomToStation; // zoomToStation is the state variable that holds the station code of the selected site
            // Get the layer ID of the current station layer
            goToStation(stationCode);
            // Reset state
            setZoomToStation(false);
        }
    }, [zoomToStation]);

    useEffect(() => {
        const addBasinPlanRegionLayer = (region) => {
            // The popup header that shows for each BP waterbody (when clicked)
            const templateTitle = (feature) => {
                const attributes = feature.graphic.attributes;
                if (!attributes.wb_name) {
                    return '<div style="padding: 4px 0"><span style="font-size: 1.05em; font-style: italic; color: #fff">Unnamed waterbody</span></div>'
                } else {
                    return `<div style="padding: 4px 0"><span style="font-size: 1.05em; color: #fff">${attributes.wb_name}</span></div>`;
                }
            }
            const buildBpPopup = (feature) => {
                // This function gets the id (wbf_id) of the clicked waterbody, queries the waterbody on the region's beneficial uses table (see bpLayerDict in utils-map), and returns the HTML content for the waterbody popup
                const attributes = feature.graphic.attributes;
                const waterbodyId = attributes['wbf_id'];
                if (attributes.wbid_t === 'Trib') {
                    attributes.wbid_t = 'Tributary';
                };
                let tableUrl;
                // Special case for R5 because R5 has two Basin Plan layers/datasets
                if (attributes['reg_id'] === '5S' || attributes['reg_id'] === '5T') {
                    tableUrl = bpLayerDict[attributes['reg_id']]['table'];
                } else {
                    // BP service only provides the region name (as Basin Plan Name) or the region identify (ex. 2S, 5T)
                    const regionNum = regionNumDict[attributes.basinplanname];
                    tableUrl = bpLayerDict[regionNum]['table'];
                }
                let dataUrl = `${tableUrl}/query?where=%22wbf_id%22%3D${waterbodyId}&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnCentroid=false&timeReferenceUnknownClient=false&sqlFormat=none&resultType=&datumTransformation=&lodType=geohash&lod=&lodSR=&f=pjson`;
                return fetch(dataUrl)
                    .then((resp) => resp.json())
                    .then((json) => {
                        if (json.features && json.features.length > 0) {
                            const records = json.features;
                            const buData = records.map((d) => d.attributes);
                            // Sort ascending order on BU code
                            buData.sort((a, b) => a.bu_code > b.bu_code);
                            // Compile HTML table for waterbody information
                            let table = `<div style="padding: 0 7px"><table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>${attributes.wbid_t}</td></tr><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>${attributes.basinplanname} (${attributes['reg_id']})</td></tr></tbody></table><div style="align-items: center; display: flex; font-size: 0.92em; font-style: italic; font-weight: 600; margin: 1em 0 0.4em 0">Beneficial uses</div>`;
                            // Compile HTML table for BU information, loop through the bu data records and create a new row for each one
                            table += '<table class="esri-widget__table"><tbody>';
                            for (const d in buData) {
                                table += '<tr><th class="esri-feature-fields__field-header">' + buData[d].bu_code + '</th><td class="esri-feature-fields__field-data">' + buData[d].bu_name + '</td></tr>';
                            };
                            table += '</tbody></table></div>';
                            return table.toString();
                        } else {
                            // If a response was received but there are no BU matches for the waterbody, return HTML content similar to above but include a message saying that there are no BUs for the waterbody
                            let table = `<div style="padding: 0 7px"><table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>${attributes.wbid_t}</td></tr><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>${attributes.basinplanname}</td></tr></tbody></table><div style="align-items: center; display: flex; font-size: 0.92em; font-style: italic; font-weight: 600; margin: 1em 0 0.4em 0">Beneficial uses</div>`;
                            table += '<div style="font-style: italic">No beneficial uses for this waterbody</div>';
                            return table.toString();
                        }
                    });
            }
            const bpTemplate = {
                outFields: ['wb_name', 'wbid_t', 'basinplanname', 'wbf_id', 'region', 'reg_id'],
                title: templateTitle,
                content: buildBpPopup
            }
            loadModules(['esri/layers/FeatureLayer', 'esri/layers/GroupLayer'])
                .then(([FeatureLayer, GroupLayer]) => {
                    // For R5, need to add a total of four layers
                    if (region === '5') {
                        // Sacramento River and San Joaquin River Basins
                        // Sublayer 1 
                        const bpLine1 = new FeatureLayer({
                            id: 'bp-line-layer-5s',
                            title: 'Sacramento River and San Joaquin River Basins (Lines)',
                            url: bpLayerDict['5S']['lines'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpLineRenderer,
                            popupTemplate: bpTemplate
                        });
                        searchRef.current.sources.push({
                            layer: bpLine1,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies 5S - Lines'
                        });
                        // Sublayer 2
                        const bpPoly1 = new FeatureLayer({
                            id: 'bp-poly-layer-5s',
                            title: 'Sacramento River and San Joaquin River Basins (Polygons)',
                            url: bpLayerDict['5S']['polys'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpPolyRenderer,
                            popupTemplate: bpTemplate
                        });
                        searchRef.current.sources.push({
                            layer: bpPoly1,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies 5S - Polys'
                        });
                        // Group Layer 1
                        bpLayerRef.current = new GroupLayer({
                            id: 'bp-group-layer-5s',
                            title: 'Basin Plan - Sacramento River and San Joaquin River Basins',
                            visible: false,
                            layers: [bpLine1, bpPoly1],
                            listMode: 'show',
                            visibilityMode: 'inherited'
                        });
                        // Tulare Lake Basin
                        // Sublayer 3
                        const bpLine2 = new FeatureLayer({
                            id: 'bp-line-layer-5t',
                            title: 'Tulare Lake Basin (Lines)',
                            url: bpLayerDict['5T']['lines'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpLineRenderer,
                            popupTemplate: bpTemplate
                        });
                        searchRef.current.sources.push({
                            layer: bpLine2,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies 5T - Lines'
                        });
                        // Sublayer 4
                        const bpPoly2 = new FeatureLayer({
                            id: 'bp-poly-layer-5t',
                            title: 'Tulare Lake Basin (Polygons)',
                            url: bpLayerDict['5T']['polys'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpPolyRenderer,
                            popupTemplate: bpTemplate
                        });
                        searchRef.current.sources.push({
                            layer: bpPoly2,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies 5T - Polys'
                        });
                        // Group Layer 2
                        bpLayer2Ref.current = new GroupLayer({
                            id: 'bp-group-layer-5t',
                            title: 'Basin Plan - Tulare Lake Basin',
                            visible: false,
                            layers: [bpLine2, bpPoly2],
                            listMode: 'show',
                            visibilityMode: 'inherited'
                        });
                        // Add layer + reorder layer to appear on bottom, above the land use layer. The bottom-most layer (base layer) has an index of 0
                        mapRef.current.add(bpLayerRef.current);
                        mapRef.current.reorder(bpLayerRef.current, 2);
                        // Add layer + reorder layer to appear on bottom, above the land use layer. The bottom-most layer (base layer) has an index of 0
                        mapRef.current.add(bpLayer2Ref.current);
                        mapRef.current.reorder(bpLayer2Ref.current, 2);
                    } else {
                        // Every other region adds two layers
                        // Sublayer 1 - Lines
                        const bpLine = new FeatureLayer({
                            id: 'bp-line-layer-' + region,
                            title: `${regionDict[region]} - Lines`,
                            url: bpLayerDict[region]['lines'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpLineRenderer,
                            popupTemplate: bpTemplate
                        });
                        // Sublayer 2 - Polys
                        const bpPoly = new FeatureLayer({
                            id: 'bp-poly-layer-' + region,
                            title: `${regionDict[region]} - Polygons`,
                            url: bpLayerDict[region]['polys'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpPolyRenderer,
                            popupTemplate: bpTemplate
                        });
                         // Group layer
                         bpLayerRef.current = new GroupLayer({
                            id: 'bp-group-layer',
                            title: 'Basin Plan - Beneficial Uses',
                            visible: false,
                            layers: [bpLine, bpPoly],
                            listMode: 'show',
                            visibilityMode: 'inherited'
                        });
                        // Add to search
                        searchRef.current.sources.push({
                            id: 'bp-line-1',
                            layer: bpLine,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies - Lines'
                        });
                        searchRef.current.sources.push({
                            id: 'bp-poly-2',
                            layer: bpPoly,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies - Polys'
                        });
                        // Add layer + reorder layer to appear on bottom, above the land use layer. The bottom-most layer (base layer) has an index of 0
                        mapRef.current.add(bpLayerRef.current);
                        mapRef.current.reorder(bpLayerRef.current, 2);
                    }
                });
        }
        const removeBasinPlanRegionLayer = () => {
            mapRef.current.remove(bpLayerRef.current); // Remove the layer from the map
            bpLayerRef.current = null; // Remove the reference
            // A special case for Region 5, need to remove 2 layers
            if (bpLayer2Ref.current) {
                mapRef.current.remove(bpLayer2Ref.current); 
                bpLayer2Ref.current = null; 
            }
            resetSearchSources(); // Do not want removed features to show up in the search widget
        }
        // Initiate updates whenever the selected region changes
        if (mapRef.current) {
            if (region) {
                refreshIntegratedReport();
                removeBasinPlanRegionLayer();
                addBasinPlanRegionLayer(region);
                zoomToRegion(regionDict[region]);
            } else {
                // Region is cleared, restore statewide view settings
                refreshIntegratedReport();
                removeBasinPlanRegionLayer();
            }
        }
    }, [region]);

    const resetSearchSources = () => {
        // Data sources can not be removed from the search widget individually (by id or some identifier). In order to reset all the sources, replace the current list of sources with a new list, which is the original list used for initiating the search widget
        // At some point, want to change this so it's not hard-coded
        searchRef.current.sources = [
            {
                layer: irLine2020Ref.current,
                searchFields: ['waterbody_id', 'waterbody_name'],
                displayField: 'waterbody_name',
                exactMatch: false,
                outFields: ['waterbody_name'],
                name: '2020-2022 Integrated Report Streams, Rivers, Beaches',
                placeholder: 'Example: Burney Creek'
            },
            {
                layer: irPoly2020Ref.current,
                searchFields: ['waterbody_id', 'waterbody_name'],
                displayField: 'waterbody_name',
                exactMatch: false,
                outFields: ['waterbody_name'],
                name: '2020-2022 Integrated Report Lakes, Bays, Reservoirs',
                placeholder: 'Example: Folsom Lake'
            },
            {
                layer: stationLayerRef.current,
                searchFields: ['StationName', 'StationCode'],
                suggestionTemplate: '{StationCode} - {StationName}',
                exactMatch: false,
                outFields: ['StationName', 'StationCode'],
                name: 'SWAMP Monitoring Stations',
                placeholder: 'Example: Buena Vista Park',
                zoomScale: 14000
            },
            // 12/26/23 - Geocoding service added to allow for searches by lat/long coordinates. Requested by FHAB program
            {
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
                singleLineFieldName: 'SingleLine',
                name: 'ArcGIS World Geocoding Service',
                placeholder: 'Latitude, Longitude',
                suggestionsEnabled: false
            }
        ];
    }

    // This function fires when highlightReferenceSites state changes based on user interaction
    // Changes the renderer (symbology) for the SWAMP station layer
    useEffect(() => {
        if (stationLayerRef) {
            if (highlightReferenceSites === true) {
                setRenderer(stationLayerRef.current, bioassessmentStationRenderer);
            } else if (highlightReferenceSites === false) {
                setRenderer(stationLayerRef.current, stationRenderer);
            } else {
                setRenderer(stationLayerRef.current, stationRenderer);
            }
        }
    }, [highlightReferenceSites]);

    const zoomToRegion = (regionName) => {
        if (viewRef.current) {
            viewRef.current.whenLayerView(regionLayerRef.current).then(() => {
                const query = regionLayerRef.current.createQuery();
                query.where = `rb_name = '${regionName}'`;
                regionLayerRef.current.queryFeatures(query).then(results => {
                    const feature = results.features[0];
                    // Feature will be null if the map service is down or not available. 
                    // Don't zoom to region (because it's an empty feature), but log the error
                    if (feature) {
                        const goto_ops = {
                            animate: false,
                            duration: 0
                        }
                        viewRef.current.goTo(feature.geometry, goto_ops);
                    } else {
                        console.error('Query for region feature is empty');
                    }
                })
            })
        }
    }

    return (
        <React.Fragment>
             <div className={mapLegendContainer}>
                <MapLegend 
                    highlightReferenceSites={highlightReferenceSites}
                    mapLoaded={mapLoaded}   
                    setHighlightReferenceSites={setHighlightReferenceSites}
                />
            </div>
            <div
                className={container}
                ref={divRef}
            />
        </React.Fragment>
    )
}