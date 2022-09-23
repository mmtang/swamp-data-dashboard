import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';

import { regionRenderer } from './map-renderer';
import { stationDataFields, convertStationDataToGraphics } from '../../utils/utils-map';

import { container } from './map-index.module.css';

export default function MapIndex2({ 
    analyte, 
    program,
    region, 
    setMapLoaded, 
    setStation,
    setStationData,
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
    
                            // Add click listener for getting station attributes when map is clicked
                            // https://gis.stackexchange.com/questions/223785/cannot-catch-click-event-on-featurelayer-in-arcgis-api-for-javascript-4
                            viewRef.current.on('click', function (evt) {  
                                // Search for symbols on click's position
                                viewRef.current.hitTest(evt.screenPoint)
                                    .then(function(response) {
                                        // Retrieve the first symbol
                                        var graphic = response.results[0].graphic;
                                        // Clicking on an empty part of the map still returns an object with attributes (ID). Check for a station attribute
                                        if (graphic.attributes.StationCode) {
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
                    drawStationLayer()
                    //drawLandUse(),
                ]).then(values => {
                    setMapLoaded(true);
                });
            });
        }
    }, [stationData])

    // Update/refresh station layer with new data
    useEffect(() => {
        if (stationLayerRef.current) {
            refreshStationLayer(stationData);
        }
    }, [stationData]);

    return (
        <div
            className={container}
            ref={divRef}
        />
    )
}