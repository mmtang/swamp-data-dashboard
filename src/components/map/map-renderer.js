import { nonReferenceSiteColor, referenceSiteColorDark } from "../../constants/constants-app"

export const bpLineRenderer = {
    type: 'unique-value',
    field: 'wbid_t',
    legendOptions: {
        title: 'Channel Type'
    },
    defaultSympbol: { type: 'simple-line' },
    uniqueValueInfos: [
        {
            value: 'Main',
            label: 'Main',
            symbol: {
                type: 'simple-line',
                color: '#0070ff',
                width: '2px'
            }
        },
        {
            value: 'Trib',
            label: 'Natural tributary',
            symbol: {
                type: 'simple-line',
                color: '#73e0ff',
                width: '2px'
            }
        },
        {
            value: 'Other',
            label: 'Other channel',
            symbol: {
                type: 'simple-line',
                color: '#b2b2b2',
                width: '2px'
            }
        }
    ]
}

export const bpPolyRenderer = {
    type: 'unique-value',
    field: 'wb_subtype',
    legendOptions: {
        title: 'Waterbody Type'
    },
    defaultSymbol: { 
        type: 'simple-fill',
        color: '#97dbf2',
        outline: {
            color: '#8cbff2'
        }
    },
    defaultLabel: 'Waterbody',
    uniqueValueInfos: [
        {
            value: 'Nearshore Zone',
            label: 'Nearshore Zone',
            symbol: {
                type: 'simple-fill',
                color: '#6fc445',
                outline: {
                    color: '#6fc445'
                },
                style: 'backward-diagonal'
            }
        },
        {
            value: 'Offshore Zone',
            label: 'Offshore Zone',
            symbol: {
                type: 'simple-fill',
                color: '#79a9f2',
                outline: {
                    color: '#79a9f2'
                },
                style: 'backward-diagonal'
            }
        },
        {
            value: 'Wetlands',
            label: 'Wetlands',
            symbol: {
                type: 'simple-fill',
                color: '#6fc445',
                outline: {
                    color: '#6fab51'
                }
            }
        }
    ]
}

export const irLineRenderer2020 = {
    type: 'unique-value',
    field: 'listing_status',
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

export const irPolyRenderer2020 = {
    type: 'unique-value',
    field: 'listing_status',
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

export const regionRenderer = {
    type: 'simple',
    symbol: {
        type: "simple-fill",
        color: 'rgba(0,0,0,0)',
        outline: {
            width: 1.4,
            color: '#5d5d5d'
        }
    }
}

export const stationRenderer = {
    type: 'simple',
    symbol: {
        type: 'simple-marker',
        size: 7.7,
        color: nonReferenceSiteColor,
        outline: {
            color: '#fff',
            width: 1
        }
    }
}

export const bioassessmentStationRenderer = {
    type: 'unique-value',
    field: 'SiteType',
    uniqueValueInfos: [{
        value: 'Non-reference site',
        symbol: {
            type: 'simple-marker',
            size: 7.7,
            color: nonReferenceSiteColor,
            outline: {
                color: '#fff',
                width: 1
            }
        }
    }, {
        value: 'Reference site',
        symbol: {
            type: 'simple-marker',
            style: 'diamond',
            size: 9,
            color: referenceSiteColorDark,
            outline: {
                color: '#fff',
                width: 1
            }
        }
    }]
}