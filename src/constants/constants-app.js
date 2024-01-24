import * as d3 from 'd3';

//export const colorPaletteViz = ['#1f77b4', '#ff7f0e', '#2ca02c', '#af7aa1', '#17becf', '#9467bd','#e377c2', '#7f7f7f', '#bcbd22', '#8c564b'];

export const colorPaletteViz = [
    '#377eb8', 
    '#66a61e',
    '#984ea3',
    '#ff7f00',
    '#17becf',
    '#b3e900',
    '#c42e60',
    '#a65628',
    '#f781bf',
    '#8dd3c7',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#fccde5',
    '#bc80bd',
    '#ffed6f',
    '#c4eaff',
    '#cf8c00',
    '#1b9e77',
    '#d95f02',
    '#e7298a',
    '#e6ab02',
    '#a6761d',
    '#0097ff',
    '#00d067',
    '#af8d00',
    '#7f80cd'
]

const shapePaletteViz = [d3.symbolCircle, d3.symbolTriangle, d3.symbolSquare, d3.symbolDiamond, d3.symbolWye];

// An alternative color to use (light turquoise/seafoam) for links on a dark background
export const linkColorAlt = {
    color: '#8beae0'
}

// Matrix colors
export const matrixColor = {
    //'benthic': '#e76f51',
    //'habitat': '#1a4d2e',
    'samplewater': '#0081a7',
    'sediment': '#917c78',
    'other': '#0f4c5c'
}

export const popupStyle = {
    backgroundColor: '#1a252f',
    borderRadius: 0,
    color: '#ffffff',
    fontSize: '0.8em'
};

export const nonReferenceSiteColor = '#046b99';
export const referenceSiteColorBright = '#f2711c';
export const referenceSiteColorDark = '#de6e28';

export const referenceSitesText = "Reference sites are sampling locations where human disturbance is absent or minimal. These sites are used to set benchmark expectations for healthy streams."

export const roundPlaces = 3;