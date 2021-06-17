import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';
import { convertStationsToGeoJSON } from '../../utils/utils';


export default function MapStation({ coordinates, stationCode, region, setNearbyStations}) {
    const stationMapDivRef = useRef(null);
    const stationMapRef = useRef(null);
    const stationViewRef = useRef(null);
    const markerRef = useRef(null);
    const markerLayerRef = useRef(null);
    const attainsLineLayerRef = useRef(null);
    const attainsPolyLayerRef = useRef(null);
    const stationLayerRef = useRef(null);


    useEffect(() => {
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
        const getLines = (distance) => {
            return new Promise((resolve, reject) => {
                // Input distance is in meters
                const url = 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/1/query?where=organizationid%3D%27CA_SWRCB%27&text=&objectIds=&time=&geometry=' + coordinates[0] + '%2C' + coordinates[1] + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=' + distance + '&units=esriSRUnit_Meter&relationParam=&outFields=assessmentunitname%2creportingcycle%2Cwaterbodyreportlink%2Coverallstatus%2Con303dlist&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson';
                fetch(url)
                    .then(response => response.json())
                    .then(json => {
                        resolve(json);
                    })
            })
        }
        const getPolys = (distance) => {
            return new Promise((resolve, reject) => {
                // Input distance is in meters
                const url = 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/2/query?where=organizationid%3D%27CA_SWRCB%27&text=&objectIds=&time=&geometry=' + coordinates[0] + '%2C' + coordinates[1] + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=' + distance + '&units=esriSRUnit_Meter&relationParam=&outFields=assessmentunitname%2creportingcycle%2Cwaterbodyreportlink%2Coverallstatus%2Con303dlist&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson';
                fetch(url)
                    .then(response => response.json())
                    .then(json => {
                        resolve(json);
                    })
            })
        } 
        const initializeMap = () => {
            return new Promise((resolve, reject) => {
                loadModules([
                    'esri/Map',
                    'esri/views/MapView',
                ]).then(([Map, MapView]) => {
                    stationMapRef.current = new Map({
                        basemap: 'topo-vector'
                    });
                    stationViewRef.current = new MapView({
                        container: stationMapDivRef.current,
                        map: stationMapRef.current,
                        center: coordinates,
                        zoom: 12
                    });
                    resolve();
                });
            })
        }
        const drawMarker = () => {
            loadModules([
                'esri/layers/GraphicsLayer',
                'esri/Graphic',
                'esri/symbols/CIMSymbol'
            ]).then(([GraphicsLayer, Graphic, CIMSymbol]) => {
                const cimSymbol = new CIMSymbol({
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
                              "y": -0.5
                            },
                            "anchorPointUnits": "Relative",
                            "dominantSizeAxis3D": "Y",
                            "size": 18.5,
                            "billboardMode3D": "FaceNearPlane",
                            "frame": {
                              "xmin": 0,
                              "ymin": 0,
                              "xmax": 21,
                              "ymax": 21
                            },
                            "markerGraphics": [
                              {
                                "type": "CIMMarkerGraphic",
                                "geometry": {
                                  "rings": [
                                    [
                                      [
                                        17.17,
                                        14.33
                                      ],
                                      [
                                        16.97,
                                        12.96
                                      ],
                                      [
                                        16.38,
                                        11.37
                                      ],
                                      [
                                        12.16,
                                        3.98
                                      ],
                                      [
                                        11.2,
                                        1.94
                                      ],
                                      [
                                        10.5,
                                        0
                                      ],
                                      [
                                        9.8,
                                        1.96
                                      ],
                                      [
                                        8.84,
                                        4.02
                                      ],
                                      [
                                        4.61,
                                        11.41
                                      ],
                                      [
                                        4.02,
                                        12.98
                                      ],
                                      [
                                        3.83,
                                        14.33
                                      ],
                                      [
                                        3.96,
                                        15.63
                                      ],
                                      [
                                        4.34,
                                        16.88
                                      ],
                                      [
                                        4.95,
                                        18.03
                                      ],
                                      [
                                        5.78,
                                        19.04
                                      ],
                                      [
                                        6.8,
                                        19.88
                                      ],
                                      [
                                        7.95,
                                        20.49
                                      ],
                                      [
                                        9.2,
                                        20.87
                                      ],
                                      [
                                        10.5,
                                        21
                                      ],
                                      [
                                        11.8,
                                        20.87
                                      ],
                                      [
                                        13.05,
                                        20.5
                                      ],
                                      [
                                        14.2,
                                        19.88
                                      ],
                                      [
                                        15.22,
                                        19.05
                                      ],
                                      [
                                        16.05,
                                        18.03
                                      ],
                                      [
                                        16.66,
                                        16.88
                                      ],
                                      [
                                        17.04,
                                        15.63
                                      ],
                                      [
                                        17.17,
                                        14.33
                                      ]
                                    ]
                                  ]
                                },
                                "symbol": {
                                  "type": "CIMPolygonSymbol",
                                  "symbolLayers": [
                                    {
                                      "type": "CIMSolidStroke",
                                      "enable": true,
                                      "capStyle": "Round",
                                      "joinStyle": "Round",
                                      "lineStyle3D": "Strip",
                                      "miterLimit": 10,
                                      "width": 1,
                                      "color": [
                                        255,
                                        255,
                                        255,
                                        255
                                      ]
                                    },
                                    {
                                      "type": "CIMSolidFill",
                                      "enable": true,
                                      "color": [
                                        241,
                                        95,
                                        43,
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
                markerRef.current = new Graphic({
                    geometry: {
                        type: 'point',
                        longitude: coordinates[0],
                        latitude: coordinates[1]
                    },
                    symbol: cimSymbol
                });
                markerLayerRef.current = new GraphicsLayer({
                    graphics: [markerRef.current]
                });
                stationMapRef.current.add(markerLayerRef.current);
            });
        }
        const drawWaterbodies = () => {
            return new Promise((resolve, reject) => {
                Promise.all([
                    getLines(100),
                    getPolys(100)
                ]).then(responses => {
                    if (stationMapRef) {
                        loadModules(['esri/layers/GeoJSONLayer'])
                        .then(([GeoJSONLayer]) => {
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
                            // Add lines
                            if (responses[0].features.length > 0) {
                                const blobLines = new Blob([JSON.stringify(responses[0])], { type: "application/json" });
                                const urlLines = URL.createObjectURL(blobLines);
                                attainsLineLayerRef.current = new GeoJSONLayer({
                                    id: 'nearbyLines',
                                    url: urlLines,
                                    outFields: ['assessmentunitname', 'reportingcycle', 'waterbodyreportlink', 'overallstatus', 'on303dlist'],
                                    renderer: attainsLineRenderer,
                                    popupTemplate: attainsTemplate
                                });
                                stationMapRef.current.add(attainsLineLayerRef.current);
                            }
                            // Add polys
                            if (responses[1].features.length > 0) {
                                const blobPolys = new Blob([JSON.stringify(responses[1])], { type: "application/json" });
                                const urlPolys = URL.createObjectURL(blobPolys);
                                attainsPolyLayerRef.current = new GeoJSONLayer({
                                    id: 'nearbyPolys',
                                    geometryType: 'polygon',
                                    url: urlPolys,
                                    outFields: ['assessmentunitname', 'reportingcycle', 'waterbodyreportlink', 'overallstatus', 'on303dlist'],
                                    renderer: attainsPolyRenderer,
                                    popupTemplate: attainsTemplate
                                });
                                stationMapRef.current.add(attainsPolyLayerRef.current);
                            }
                            resolve();
                        });
                    }
                });
            });
        }
        const findNearbyStations = () => {
          if (stationViewRef.current) {
            loadModules(['esri/layers/GeoJSONLayer'])
              .then(([GeoJSONLayer]) => {
                const url = `https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=StationName%2CStationCode%2CRegion%2CTargetLatitude%2CTargetLongitude&filters={%22Region%22:%22${region}%22}&limit=2500`;
                fetch(url)
                  .then((resp) => resp.json())
                  .then((json) => json.result.records)
                  .then((records) => {
                    const stationData = convertStationsToGeoJSON(records);
                    console.log(stationData);
                    const blob = new Blob([JSON.stringify(stationData)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    stationLayerRef.current = new GeoJSONLayer({
                      id: 'stations',
                      url: url,
                      outFields: ['StationName', 'StationCode'],
                      visible: false
                    });
                    // Add layer to map
                    stationMapRef.current.add(stationLayerRef.current);
                    // Find nearby sites
                    loadModules(['esri/views/layers/LayerView', 'esri/tasks/support/Query'])
                      .then(([LayerView, Query]) => {
                        if (stationViewRef.current) {
                          stationViewRef.current.whenLayerView(stationLayerRef.current).then((layerView) => {
                              const query = stationLayerRef.current.createQuery();
                              query.geometry = {
                                type: 'point',
                                longitude: coordinates[0],
                                latitude: coordinates[1],
                                spatialReference: { wkid: 4326 }
                              };
                              query.distance = 500;
                              query.units = 'meters';
                              query.returnGeometry = false;
                              query.outfields = ['StationCode', 'StationName', 'Region'];
                              stationLayerRef.current.queryFeatures(query)
                                .then(results => {
                                  const resultsFeatures = results.features.map(d => d.attributes);
                                  const features = resultsFeatures.filter(d => d.StationCode !== stationCode);
                                  setNearbyStations(features);
                                });
                            })
                        }
                      });
                  });
              });
          }
        }

        setDefaultOptions({ version: '4.16' });
        loadCss();
        initializeMap()
        .then(() => {
            drawWaterbodies()
                .then(() => {
                    drawMarker();
                    findNearbyStations();
                });
        });
    }, []);



    return (
        <div 
            className="stationMapDiv" 
            ref={stationMapDivRef}
            style={{ width: '100%', height: '260px' }} />
    )
}