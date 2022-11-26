import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
// Load helper functions and constants
import { bpLineRenderer, bpPolyRenderer, irLineRenderer, irPolyRenderer, regionRenderer } from './map-renderer';
import { bpLayerDict, convertStationDataToGraphics, stationDataFields } from '../../utils/utils-map';
import { irRegionDict, regionDict } from '../../utils/utils';
// Load styles
import { container } from './map-index.module.css';

export default function MapIndex2({ 
    region,
    comparisonSites,
    selecting,
    setMapLoaded, 
    setComparisonSites,
    setSelecting,
    setStation,
    setZoomToStation,
    station,
    stationData,
    zoomToStation
}) {
    // Declare component references
    const basemapGalleryRef = useRef(null);
    const bpLayerRef = useRef(null); // The main Basin Plan group layer ref used for all regions
    const bpLayer2Ref = useRef(null); // Used only for R5, which has two Basin Plan layers/datasets
    const divRef = useRef(null);
    const expandGalleryRef = useRef(null);
    const irLayerRef = useRef(null); // Integrated Report group layer ref
    // IR Sublayers - Need to have separate refs for both layers because the features in each layer will be filtered by region based on user selection. The refs are needed to change the layer's definition expression
    const irLineRef = useRef(null);
    const irPolyRef = useRef(null); 
    const landUseLayerRef = useRef(null);
    const layerListRef = useRef(null);
    const listenerRef = useRef(null); // Used for keeping track of selection modes, example: user selecting comparison sites
    const mapRef = useRef(null);
    const regionLayerRef = useRef(null);
    const searchRef = useRef(null);
    const stationLayerRef = useRef(null);
    const viewRef = useRef(null);

    // This ref is used to store the old array of site code strings. Will be compared to the new array.
    const comparisonSitesRef = useRef(null);

    // This function fetches and renders the region layer service
    // This layer is immediately added to the map, unlike other layers on the map, because the region values are used very early on during initialization of component
    const drawRegions = () => {
        return new Promise((resolve, reject) => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer'])
                .then(([FeatureLayer]) => {
                    regionLayerRef.current = new FeatureLayer({
                        id: 'region-layer',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Regional_Board_Boundary_Features/FeatureServer/1',
                        // listMode: With this option, the layer is not shown in layer legend/list, and therefore the user cannot change the visibility of the layer. Better to always show it because there are many filters being applied on a region by region basis. Can always make this layer "toggleable" in the future if there is feedback requesting it
                        listMode: 'hide', 
                        renderer: regionRenderer
                    });
                    mapRef.current.add(regionLayerRef.current);
                    resolve();
                });
            }
        })
    }

    const drawIntegratedReport = () => {
        const irTemplate = {
            // Must include these outfields here (and in the layer creator) for the content function to receive the feature attributes
            outFields: ['wbid', 'wbname', 'rb', 'wbtype', 'wb_category', 'wb_listingstatus', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_', 'fact_sheet'],
            title: '<div style="padding: 4px 0"><span style="font-size: 1.05em; color: #ffffff">{wbname}</span></div>',
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
        return new Promise((resolve, reject) => {
            if (mapRef) {
                loadModules(['esri/layers/FeatureLayer', 'esri/layers/GroupLayer'])
                .then(([FeatureLayer, GroupLayer]) => {
                    irLineRef.current = new FeatureLayer({
                        id: 'ir-line-layer',
                        title: 'Streams, Rivers, Beaches',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/0',
                        outfields: ['wbid', 'wbname', 'est_size_a', 'size_assess', 'wbtype', 'rb', 'wb_category', 'wb_listingstatus', 'fact_sheet', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_'],
                        popupTemplate: irTemplate,
                        listMode: 'hide',
                        renderer: irLineRenderer
                    });
                    irPolyRef.current = new FeatureLayer({
                        id: 'ir-poly-layer',
                        title: 'Lakes, Bays, Reservoirs',
                        url: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/1',
                        outfields: ['wbid', 'wbname', 'est_size_a', 'size_assess', 'wbtype', 'rb', 'wb_category', 'wb_listingstatus', 'fact_sheet', 'listed_pollutants', 'listed_pollutant_w_tmdl', 'listed_pollutant_addressed_by_n', 'pollutants_assessed_not_listed_'],
                        popupTemplate: irTemplate,
                        renderer: irPolyRenderer,
                        listMode: 'hide',
                        opacity: 0.8
                    });
                    irLayerRef.current = new GroupLayer({
                        id: 'ir-group-layer',
                        title: '2018 Integrated Report',
                        visible: true,
                        layers: [irLineRef.current, irPolyRef.current],
                        listMode: 'show',
                        visibilityMode: 'inherited'
                    });

                    resolve();
                });
            }
        })
    }

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
                            legendUrl: 'https://www.mrlc.gov/geoserver/mrlc_display/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&WIDTH=12&HEIGHT=12&LAYER=NLCD_2019_Land_Cover_L48&legend_options=fontAntiAliasing:true;fontSize:8;dpi:100'
                        }],
                        copyright: 'MRLC NLCD',
                        listMode: 'hide-children',
                        opacity: 0.5,
                        visible: false
                    });
                    //mapRef.current.add(landUseLayerRef.current);
                    resolve();
                });
            }
        })
    };

    // Refreshes the Integrated Report layers based on user selection
    const refreshIntegratedReport = () => {
        const constructDefExpLine = () => {
            if (region) {
                return `rb = '${irRegionDict[regionDict[region]]}'`;
            } else if (!region) {
                return '';
            }
        }
        const constructDefExpPoly = () => {
            if (region) {
                return `rb_1 = '${irRegionDict[regionDict[region]]}'`;
            } else if (!region) {
                return '';
            }
        }
        if (mapRef.current) {
            // Update filters
            irLineRef.current.definitionExpression = constructDefExpLine();
            irPolyRef.current.definitionExpression = constructDefExpPoly();
        }
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
            setTimeout(() => {
                stationLayerRef.current.applyEdits({
                    addFeatures: newFeatures,
                });
                setTimeout(() => {
                    setMapLoaded(true);
                }, 1000)
            }, 100); // Set timeout to prevent flashing on the map. I picked 100ms because this timing seems to work well with the map's loading indicator (automatically generated)
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
                searchRef.current = new Search({
                    view: viewRef.current,
                    container: 'searchContainer',
                    allPlaceholder: 'Find a station, waterbody',
                    includeDefaultSources: false,
                    locationEnabled: false,
                    popupEnabled: false,
                    autoSelect: true,
                });

                // Define layer list widget
                layerListRef.current = new LayerList({
                    view: viewRef.current,
                    container: 'layerListContainer',
                    listItemCreatedFunction: function(event) {
                        const item = event.item;
                        //if (item.layer.type !== 'group') {
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
                loadModules(['esri/layers/FeatureLayer'])
                .then(([FeatureLayer]) => {
                    if (mapRef) {
                        convertStationDataToGraphics(stationData)
                        .then(res => {
                            stationLayerRef.current = new FeatureLayer({
                                id: 'station-layer',
                                objectIdField: 'ObjectId',
                                geometryType: 'point',
                                spatialReference: 3857,
                                title: 'SWAMP Stations',
                                source: res,
                                fields: stationDataFields,
                                outFields: ['*'],
                                renderer: stationRenderer,
                                popupTemplate: stationTemplate
                            });
    
                            // Add hover listener to display tooltip
                            // https://support.esri.com/en/technical-article/000024297
                            // https://developers.arcgis.com/javascript/latest/sample-code/view-hittest/
    
                            // variable for tracking last station that was hovered (use StationCode)
                            // this has to be initiated outside of the on pointer-move function

                            /*
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

                                        // viewRef.current.popup.close(); 

                                        lastStationHovered = null;
                                    }
                                });
                            });
                            */

                            resolve();
                        });
                    } else {
                        console.error('Missing map object')
                    }
                });
            })
        };

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
                    // Add layers in order
                    mapRef.current.addMany([
                        landUseLayerRef.current, 
                        irLayerRef.current, 
                        stationLayerRef.current
                    ]);
                    resetSearchSources(); // Initialize search sources
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
                            setStation(graphic.attributes);
                        }
                    });
            }); 
        }
    }, [viewRef.current])

    // Need to update the ref value everytime comparisonSites changes. 
    // The function, addToComparisonList cannot read from the updated comparisonList state, so we must store the updated value in the ref every time the state changes
    useEffect(() => {
        comparisonSitesRef.current = comparisonSites;
    }, [comparisonSites]);

    // This function checks if a station is already in the comparison sites array. If it does not already exist, then it adds the new value to the state array
    // This runs when a station on the map is clicked and the selecting mode is on (true)
    const addToComparisonList = (stationObj) => {
        if (stationObj) {
            // Check that the clicked site isn't the same as the currently selected site
            if (stationObj.StationCode !== station.StationCode) {
                // Check if site has already been selected. If not already selected (-1), add to existing array
                // Use the ref value here, not the state, because this function cannot get the updated state. There is a useEffect function that updates the ref value whenever state changes
                const selectedCodes = comparisonSitesRef.current.map(d => d.StationCode);
                if (selectedCodes.indexOf(stationObj.StationCode) === -1) {
                    const newObj = {
                        StationCode: stationObj.StationCode,
                        StationName: stationObj.StationName
                    }
                    setComparisonSites(comparisonSites => [...comparisonSites, newObj]);
                } else {
                    console.log(`${stationObj.StationCode} has already been selected`);
                }
            } else {
                console.log(`${stationObj.StationCode} is the currently selected site`);
            }
        }
    }

    useEffect(() => {
        if (stationLayerRef.current) {
            refreshStationLayer(stationData);
        }
    }
    , [stationData]);

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
            // Having this check here prevents the highlight on the map from clearing when a station is "deselected". Test more and then delete
            /* if (station) { */
                viewRef.current.whenLayerView(layer).then(() => {
                    removeSiteHighlights();
                    if (station) {
                        setTimeout(() => {
                            addSiteHighlight(layer, station); 
                        }, 500)
                    }
                });
            /* } */
        }
    }, [station]);

    useEffect(() => {
        const zoomToRegion = (regionName) => {
            if (viewRef.current) {
                viewRef.current.whenLayerView(regionLayerRef.current).then(() => {
                    const query = regionLayerRef.current.createQuery();
                    query.where = `rb_name = '${regionName}'`;
                    regionLayerRef.current.queryFeatures(query).then(results => {
                        const feature = results.features[0];
                        viewRef.current.goTo(feature.geometry);
                    })
                })
            }
        }
        const addBasinPlanRegionLayer = (region) => {
            const templateTitle = (feature) => {
                const attributes = feature.graphic.attributes;
                if (!attributes.wb_name) {
                    return '<div style="padding: 4px 0"><span style="font-size: 1.05em; font-style: italic; color: #fff">Unnamed waterbody</span></div>'
                } else {
                    return `<div style="padding: 4px 0"><span style="font-size: 1.05em; color: #fff">${attributes.wb_name}</span></div>`;
                }
            }
            const buildLinePopup = (feature) => {
                const attributes = feature.graphic.attributes;
                if (attributes.wbid_t === 'Trib') {
                    attributes.wbid_t = 'Tributary';
                };
                const waterbodyId = attributes['objectid'];
                let layerUrl;
                // Special case for R5 because R5 has two Basin Plan layers/datasets
                if (attributes.reg_id === '5S' || attributes.reg_id === '5T') {
                    layerUrl = bpLayerDict[attributes['reg_id']]['lines'];
                } else {
                    layerUrl = bpLayerDict[attributes['region']]['lines'];
                }
                let dataUrl = `${layerUrl}/queryRelatedRecords?objectIds=${waterbodyId}&relationshipId=0&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&historicMoment=&returnZ=false&returnM=false&multipatchOption=xyFootprint&returnTrueCurves=false&timeReferenceUnknownClient=false&datumTransformation=&f=pjson`;
                return fetch(dataUrl)
                    .then((resp) => resp.json())
                    .then((json) => {
                        if (json.relatedRecordGroups && json.relatedRecordGroups.length > 0) {
                            const records = json.relatedRecordGroups[0].relatedRecords;
                            const buData = records.map((d) => d.attributes);
                            buData.sort((a, b) => a.bu_code > b.bu_code);
                            // Table for waterbody information
                            let table = `<div style="padding: 0 7px"><table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>${attributes.wbid_t}</td></tr><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>${attributes.basinplanname}</td></tr></tbody></table><div style="align-items: center; display: flex; font-size: 0.92em; font-style: italic; font-weight: 600; margin: 1em 0 0.4em 0">Beneficial uses</div>`;
                            // Table for beneficial uses
                            table += '<table class="esri-widget__table"><tbody>';
                            for (const d in buData) {
                                table += '<tr><th class="esri-feature-fields__field-header">' + buData[d].bu_code + '</th><td class="esri-feature-fields__field-data">' + buData[d].bu_name + '</td></tr>';
                            };
                            table += '</tbody></table></div>';
                            return table.toString();
                        } 
                    });
            }
            const buildPolyPopup = (feature) => {
                const attributes = feature.graphic.attributes;
                const waterbodyId = attributes['objectid'];
                let layerUrl;
                // Special case for R5 because R5 has two Basin Plan layers/datasets
                if (attributes.reg_id === '5S' || attributes.reg_id === '5T') {
                    layerUrl = bpLayerDict[attributes['reg_id']]['polys'];
                } else {
                    layerUrl = bpLayerDict[attributes['region']]['polys'];
                }
                let dataUrl = `${layerUrl}/queryRelatedRecords?objectIds=${waterbodyId}&relationshipId=1&outFields=*&definitionExpression=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&historicMoment=&returnZ=false&returnM=false&multipatchOption=xyFootprint&returnTrueCurves=false&timeReferenceUnknownClient=false&datumTransformation=&f=pjson`;
                return fetch(dataUrl)
                    .then((resp) => resp.json())
                    .then((json) => {
                        if (json.relatedRecordGroups && json.relatedRecordGroups.length > 0) {
                            const records = json.relatedRecordGroups[0].relatedRecords;
                            const buData = records.map((d) => d.attributes);
                            buData.sort((a, b) => a.BU_CODE > b.BU_CODE);
                            // Table for waterbody information
                            let table = `<div style="padding: 0 7px"><table class="esri-widget__table"><tbody><tr><th class="esri-feature-fields__field-header">Waterbody type</th><td>${attributes.wbid_t}</td></tr><tr><th class="esri-feature-fields__field-header">Basin Plan</th><td>${attributes.basinplanname}</td></tr></tbody></table><div style="align-items: center; display: flex; font-size: 0.92em; font-style: italic; font-weight: 600; margin: 1em 0 0.4em 0">Beneficial uses</div>`;
                            // Table for beneficial uses
                            table += '<table class="esri-widget__table"><tbody>';
                            for (const d in buData) {
                                table += '<tr><th class="esri-feature-fields__field-header">' + buData[d].bu_code + '</th><td class="esri-feature-fields__field-data">' + buData[d].bu_name + '</td></tr>';
                            };
                            table += '</tbody></table></div>'
                            return table.toString();
                        } 
                    });
                
            }
            const bpLineTemplate = {
                outFields: ['wb_name', 'wbid_t', 'basinplanname', 'wbf_id', 'region', 'reg_id'],
                title: templateTitle,
                content: buildLinePopup
            }
            const bpPolyTemplate = {
                outFields: ['wb_name', 'wbid_t', 'basinplanname', 'wbf_id', 'region', 'reg_id'],
                title: templateTitle,
                content: buildPolyPopup
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
                            popupTemplate: bpLineTemplate
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
                            popupTemplate: bpPolyTemplate
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
                            popupTemplate: bpLineTemplate
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
                            popupTemplate: bpPolyTemplate
                        });
                        searchRef.current.sources.push({
                            layer: bpPoly2,
                            searchFields: ['wb_name'],
                            displayField: 'wb_name',
                            exactMatch: false,
                            outFields: ['wb_name'],
                            name: 'Basin Plan Waterbodies 5T - Polys'
                        });
                        // Group layer
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
                        // Sublayer 1 - Feature Layer
                        const bpLine = new FeatureLayer({
                            id: 'bp-line-layer-' + region,
                            title: `${regionDict[region]} - Lines`,
                            url: bpLayerDict[region]['lines'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpLineRenderer,
                            popupTemplate: bpLineTemplate
                        });
                        // Sublayer 2
                        const bpPoly = new FeatureLayer({
                            id: 'bp-poly-layer-' + region,
                            title: `${regionDict[region]} - Polygons`,
                            url: bpLayerDict[region]['polys'],
                            outfields: ['*'],
                            listMode: 'hide',
                            renderer: bpPolyRenderer,
                            popupTemplate: bpPolyTemplate
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
            mapRef.current.remove(bpLayerRef.current);
            bpLayerRef.current = null;
            if (bpLayer2Ref.current) {
                mapRef.current.remove(bpLayer2Ref.current);
                bpLayer2Ref.current = null;
            }
            resetSearchSources();
        }

        if (mapRef.current) {
            if (region) {
                refreshIntegratedReport();
                removeBasinPlanRegionLayer();
                addBasinPlanRegionLayer(region);
                zoomToRegion(regionDict[region]);
            } else {
                refreshIntegratedReport();
                removeBasinPlanRegionLayer();
            }
        }
    }, [region]);

    const addSiteHighlight = (layer, station) => {
        viewRef.current.whenLayerView(layer).then((layerView) => {
            const query = layer.createQuery();
            query.where = `StationCode = '${station.StationCode}'`;
            layer.queryFeatures(query)
            .then(results => {
                if (results.features.length > 0) {
                    const feature = results.features[0].attributes.ObjectId;
                    layerView.highlight(feature);
                }
            });
        })
    };

    const removeSiteHighlights = (layer) => {
        // Have to do an extra query here for removing the highlight, see end of function (can't used the passed layer object)
        const layerId = 'station-layer';
        const stationLayer = viewRef.current.allLayerViews.items.filter(d => d.layer.id === layerId)[0];   
        stationLayer._highlightIds.clear();
        stationLayer._updateHighlight(); 
    }

    const resetSearchSources = () => {
        searchRef.current.sources = [
            {
                layer: irLineRef.current,
                searchFields: ['wbid', 'wbname'],
                displayField: 'wbname',
                exactMatch: false,
                outFields: ['wbname'],
                name: '2018 Integrated Report Streams, Rivers, Beaches',
                placeholder: 'Example: Burney Creek'
            },
            {
                layer: irPolyRef.current,
                searchFields: ['wbid', 'wbname'],
                displayField: 'wbname',
                exactMatch: false,
                outFields: ['wbname'],
                name: '2018 Integrated Report Lakes, Bays, Reservoirs',
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
            }
        ];
    }

    return (
        <div
            className={container}
            ref={divRef}
        />
    )
}