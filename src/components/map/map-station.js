import React, { useEffect, useRef } from 'react';
import { loadCss, loadModules, setDefaultOptions } from 'esri-loader';


export default function MapStation({ coordinates }) {
    const stationMapDivRef = useRef(null);
    const stationMapRef = useRef(null);
    const stationViewRef = useRef(null);
    const markerRef = useRef(null);
    const markerLayerRef = useRef(null);


    useEffect(() => {
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
                        zoom: 12,
                        navigation: {
                          mouseWheelZoomEnabled: false,
                          browserTouchPanEnabled: false
                        }
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

        setDefaultOptions({ version: '4.21' });
        loadCss();
        initializeMap()
        .then(() => {
          drawMarker();
        });
    }, []);

  return (
    <div 
      className="stationMapDiv" 
      ref={stationMapDivRef}
      style={{ width: '100%', height: '260px' }} 
    />
  )
}