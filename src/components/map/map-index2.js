import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';

import { regionRenderer } from './map-renderer';
import { stationDataFields, convertStationDataToGraphics } from '../../utils/utils-map';

import { container } from './map-index.module.css';

export default function MapIndex2({ 
    selectedSites,
    setMapLoaded, 
    setSelectedSites,
    setStation,
    setZoomToStation,
    stationData,
    zoomToStation
}) {
    // Declare component references
    const divRef = useRef(null);
    const mapRef = useRef(null);
    const viewRef = useRef(null);
    // const searchRef = useRef(null);
    const stationLayerRef = useRef(null);
    const layerListRef = useRef(null);
    const regionLayerRef = useRef(null);
    const expandLayerListRef = useRef(null);
    const expandGalleryRef = useRef(null);
    const basemapGalleryRef = useRef(null);

    // This ref is used to store the old array of site code strings. Will be compared to the new array.
    const selectedSitesRef = useRef(null);

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

    // https://community.esri.com/t5/arcgis-api-for-javascript-questions/is-there-a-way-to-load-update-the-data-without/td-p/251114
    const refreshStationLayer = async (data) => {
        // Query current features
        const currentFeatures = await stationLayerRef.current.queryFeatures();
        // Convert new station data to graphics
        const newFeatures = await convertStationDataToGraphics(data);
        // It is possible to combine both deleteFeatures and addFeatures into one applyEdits function, but this causes some unattractive flickering on the map as the stations rerender. I prefer deleting the features first and then adding the new features in successive order
        stationLayerRef.current.applyEdits({
            deleteFeatures: currentFeatures.features, // delete the old features
        }).then((results) => {
            stationLayerRef.current.applyEdits({
                addFeatures: newFeatures,
            });
        });
    }

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
                // Define map
                mapRef.current = new Map({
                    basemap: 'topo-vector'
                });

                // Define map view
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
                    }
                });

                // Define search widget
                /*
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
                */

                // Define layer list widget
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

                // Define basemap gallery widget
                // List of basemap ids: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
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

    // Initial load; see second useEffect for updating the station layer
    useEffect(() => {
        const drawStationLayer = () => {
            return new Promise((resolve, reject) => {
                const stationRenderer = {
                    type: 'simple',
                    symbol: {
                        type: 'simple-marker',
                        size: 6,
                        color: '#046b99',
                        outline: {
                            color: '#fff',
                            width: 0.8
                        }
                    }
                }
                const stationTemplate = {
                    title: '<div style="background-color: ##2b2b2b; color: #fff; text-align: center">{StationName}</div>'
                };
                loadModules(['esri/layers/FeatureLayer', 'esri/core/watchUtils'])
                .then(([FeatureLayer]) => {
                    if (mapRef) {
                        convertStationDataToGraphics(stationData)
                        .then(res => {
                            stationLayerRef.current = new FeatureLayer({
                                id: 'station-layer',
                                objectIdField: 'ObjectId',
                                geometryType: 'point',
                                spatialReference: 3857,
                                title: 'SWAMP Monitoring Stations',
                                source: res,
                                fields: stationDataFields,
                                outFields: ['*'],
                                renderer: stationRenderer,
                                popupTemplate: stationTemplate
                            });
                            // Add layer to map
                            mapRef.current.add(stationLayerRef.current);
    
                            // Add station layer data to search
                            /*
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
                            */
    
                            // Add hover listener to display tooltip
                            // https://support.esri.com/en/technical-article/000024297
                            // https://developers.arcgis.com/javascript/latest/sample-code/view-hittest/
    
                            // variable for tracking last station that was hovered (use StationCode)
                            // this has to be initiated outside of the on pointer-move function
                            let lastStationHovered = null;
    
                            viewRef.current.on('pointer-move', (event) => {
                                // only include graphics from the station layer in the hitTest
                                const opts = {
                                include: stationLayerRef.current
                                }
                                viewRef.current.hitTest(event, opts).then((response) => {
                                    // check if a feature is returned from the station layer
                                    if (response.results.length) {
                                        const graphic = response.results[0].graphic;
                                        // check if still over the same graphic, this is required for smooth hover tooltips. do not remove the if statement and its contents
                                        // https://community.esri.com/t5/arcgis-api-for-javascript-questions/smooth-hover-mouseover-tooltips-in-jsapi-v4/m-p/706938/highlight/true#M65797
                                        if (graphic.attributes.StationCode !== lastStationHovered) {
                                            // open graphic's popup
                                            viewRef.current.popup.open({ 
                                                location: graphic.geometry.centroid, 
                                                features: [graphic] 
                                            }); 
                                            lastStationHovered = graphic.attributes.StationCode;
                                        };
                                    } else { 
                                        // close graphic's popup
                                        viewRef.current.popup.close(); 
                                        lastStationHovered = null;
                                    }
                                });
                            });
    
                            // Add listener for clicking on a site
                            // https://gis.stackexchange.com/questions/223785/cannot-catch-click-event-on-featurelayer-in-arcgis-api-for-javascript-4
                            viewRef.current.on('click', function (evt) {  
                                // Search for symbols on click's position
                                viewRef.current.hitTest(evt.screenPoint)
                                    .then(function(response) {
                                        // Retrieve the first symbol
                                        var graphic = response.results[0].graphic;
                                        // Clicking on an empty part of the map still returns an object with attributes (ID). Check for a station attribute
                                        if (graphic.attributes.StationCode) {
                                            addToSelectedList(graphic.attributes.StationCode);
                                            setStation(graphic.attributes);
                                        }
                                    });
                            }); 
                            resolve();
                        });
                    } else {
                        console.error('Missing map object')
                    }
                });
            })
        };

        if (!mapRef.current && stationData) {
            setDefaultOptions({ version: '4.22' });
            loadCss();
            initializeMap().then(() => {
                Promise.all([
                    drawRegions(),
                    //drawStationLayer()
                    //drawLandUse(),
                ]).then(values => {
                    setMapLoaded(true);
                });
            });
        }
    }, [stationData])

    // This function checks if a station is already in the selected sites array;
    // If it does not already exist, then it adds the new value to the state array
    const addToSelectedList = (stationCode) => {
        if (stationCode) {
            setSelectedSites(selectedSites => {
                // Ideally we would put this conditional statement outside (and just before) the set state function, but doing that would give us an stale, empty state array because the value is based off what it is when the function is initiated. Using this anonymous function is the only way I've tried that gives the correct, updated state array
                if (selectedSites.indexOf(stationCode) === -1) {
                    return new Array(stationCode);
                    // Change the above line to the one below to keep track of multiple selections
                    // return [...selectedSites, stationCode];
                } else {
                    // Even though we are returning a new value, state does not update because the new array is unchanged from the current array
                    return selectedSites;
                }
            });
        }
    }

    // Update/refresh station layer with new data
    useEffect(() => {
        if (stationLayerRef.current) {
            refreshStationLayer(stationData);
        }
    }, [stationData]);

    useEffect(() => {
        if (zoomToStation) {
            const stationCode = zoomToStation;
            // Get the layer ID of the current station layer
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
                layer.queryFeatures(query).then((results) => {
                    // Zoom to the matched result
                    const feature = results.features[0];
                    viewRef.current.goTo({
                        target: feature.geometry,
                        zoom: 13
                    });
                });
            });
            // Reset state
            setZoomToStation(false);
        }
    }, [zoomToStation]);

    useEffect(() => {
        if (viewRef.current) {
            const layer = stationLayerRef.current;
            if (selectedSitesRef.current) {
                viewRef.current.whenLayerView(layer).then(() => {
                    // Compare to previous selection and identify added/removed sites
                    const addedSites = selectedSites.filter(d => !selectedSitesRef.current.includes(d));
                    const removedSites = selectedSitesRef.current.filter(d => !selectedSites.includes(d));
                    if (addedSites.length > 0) { 
                        addSiteHighlight(layer, addedSites[0]); 
                    } 
                    if (removedSites.length > 0) {
                        // Delay removal of highlight a little bit due to an issue with ArcGIS JS where the highlight will flash twice before being removed. I think this is because it is trying to perform both operations (add + remove) simultaneously
                        setTimeout(() => {
                            removeSiteHighlight(layer, removedSites);
                        }, 250)
                        
                    }
                    selectedSitesRef.current = selectedSites;
                });
            } else {
                 // Initialize selectedSitesRef
                // Should run for first selection only
                if (selectedSites.length > 0) {
                    addSiteHighlight(layer, selectedSites[0]);
                    selectedSitesRef.current = selectedSites;
                }
            }
        }
    }, [selectedSites]);

    const addSiteHighlight = (layer, stationCode) => {
        viewRef.current.whenLayerView(layer).then((layerView) => {
            const query = layer.createQuery();
            query.where = `StationCode = '${stationCode}'`;
            layer.queryFeatures(query)
            .then(results => {
                if (results.features.length > 0) {
                    const feature = results.features[0].attributes.ObjectId;
                    layerView.highlight(feature);
                }
            });
        })
    };

    const removeSiteHighlight = (layer, stationCodes) => {
        // Have to do an extra query here for removing the highlight, see end of function (can't used the passed layer object)
        const layerId = 'station-layer';
        const stationLayer = viewRef.current.allLayerViews.items.filter(d => d.layer.id === layerId)[0];   
        // Handling one highlight removal is different than clearing all highlights. 
        if (stationCodes.length === 1) {
            // We want to remove the one highlight without causing flashing.
            const query = layer.createQuery();
            query.where = `StationCode = '${stationCodes[0]}'`;
            layer.queryFeatures(query)
            .then(results => {
                if (results.features.length > 0) {
                    // Get Object ID of the feature to be removed
                    const featureId = results.features[0].attributes.ObjectId;
                    // Query to get the layer object, which contains a map of all highlighted features
                    stationLayer._highlightIds.delete(featureId);
                    stationLayer._updateHighlight(); 
                }
            });
        } else if (stationCodes.length > 1) {
            // If there is more than one site code to be removed, remove all elements from the map object
            stationLayer._highlightIds.clear();
            stationLayer._updateHighlight(); 
        }   
    }

    return (
        <div
            className={container}
            ref={divRef}
        />
    )
}