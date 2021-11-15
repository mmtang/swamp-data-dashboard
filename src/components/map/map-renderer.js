export const irLineRenderer = {
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

export const irPolyRenderer = {
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
        size: 5.5,
        color: '#046b99',
        outline: {
            color: '#fff',
            width: 1
        }
    }
}