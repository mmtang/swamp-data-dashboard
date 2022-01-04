import React, { useState, useEffect, useRef } from 'react';
import AnalyteCard from '../map-controls/analyte-card';
import AnalyteIconGrid from './analyte-icon-grid';
import DownloadData from '../common/download-data';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { analyteYMax, analyteScoringCategories, analytes, chemDataFields, habitatDataFields } from '../../utils/constants';
import { colorPaletteViz, habitatAnalytes } from '../../utils/utils';
import { axisBlue, axisOrange, axisGreen, axisPurple, customTooltip, legendContainer, chartFooter, analyteSection, rowButton, downloadWrapper, modalContent } from './chart-station.module.css';


export default function ChartStation({ station, stationName, selectedAnalytes }) {
    const [data, setData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = d3.timeFormat('%b %e, %Y');
    const formatNumber = d3.format(',');
    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));

    const responsive = (id) => {
        // get container + svg aspect ratio
        const svg = d3.select('#' + id),
            container = svg.node().parentNode,
            width = parseInt(svg.style('width')),
            height = parseInt(svg.style('height')),
            aspect = width / height;
        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('perserveAspectRatio', 'xMinYMid')
            .call(resize);
        // to register multiple listeners for same event type, 
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on('resize.' + container.id, resize);
        // get width of container and resize svg to fit it
        function resize() {
            const targetWidth = parseInt(container.offsetWidth);
            svg.attr('width', targetWidth);
            svg.attr('height', Math.round(targetWidth / aspect));
        }
    }

    const drawChart = () => {
        const chartId = 'chart-' + randomId.current;
        const margin = { top: 20, right: 35, bottom: 30, left: 40 };
        const width = 645 + margin.left + margin.right;
        const height = 220 + margin.top + margin.bottom;
        const clipPadding = 4;

        const chart = d3.select('#station-chart-container').append('svg')
            .attr('id', chartId)
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height)
            .call(() => { responsive(chartId); });
        chart.append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('x', margin.left - clipPadding)
            .attr('y', 0)
            .attr('width', width - margin.left - margin.right + clipPadding * 2)
            .attr('height', height - margin.bottom +clipPadding);
        chart.append('clipPath')
            .attr('id', 'clean-clip')
            .append('rect')
            .attr('x', margin.left)
            .attr('y', 0)
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.bottom);
        // add tooltip
        const tooltip = d3.select('body').append('div')
            .attr('id', 'station-chart-tooltip')
            .attr('class', customTooltip)
            .style('opacity', 0);
        // Define scales
        const analyteKeys = Object.keys(data);
        // Store units for legend
        let allDates = [];
        for (const key in analyteKeys) {
            //const obj = data[analyteKeys[key]];
            const dates = data[analyteKeys[key]].data.map(d => d.SampleDate);
            allDates = [...allDates, ...dates];
        }
        const xExtent = d3.extent(allDates);
        const xScale = d3.scaleTime()
            .domain(xExtent)
            .range([margin.left, width - margin.right]);

        // Define multiple y-axes by first finding the result max and min for each dataset
        for (const key in analyteKeys) {
            const analyteName = analyteKeys[key];
            const results = data[analyteName].data.map(d => d.Result);
            let yMax = d3.max(results);
            const yMin = d3.min(results);

            if (analyteKeys.length === 1 && Object.keys(analyteYMax).includes(analyteKeys[0])) {
                yMax = analyteYMax[analyteKeys[0]];
            }
            // store back in original data object
            data[analyteName]['yMax'] = yMax;
            data[analyteName]['yMin'] = yMin;
        }
        // Create a y-scale and y-axis for each dataset and store in dictionary for later access
        for (const key in analyteKeys) {
            const analyteName = analyteKeys[key];
            data[analyteName]['yScale'] = d3.scaleLinear()
                //.domain([data[analyteName].yMin, data[analyteName].yMax])
                .domain([0, data[analyteName].yMax])
                .range([height - margin.bottom, margin.top]);
            data[analyteName]['yAxis'] = d3.axisLeft()
                .scale(data[analyteName]['yScale']);
        }
        // Define x-axis
        const xAxis = d3.axisBottom()
            .scale(xScale);
        
        // Draw x-axis
        chart.append('g')
            .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
            .call(xAxis);
        
        // Draw y-axes
        for (const key in analyteKeys) {
            const analyteName = analyteKeys[key];
            // Use double equal (value equality), not triple equal (value and type equality); otherwise, y-axes won't show up
            if (key == 0) {
                chart.append('g')
                    .attr('class', axisBlue)
                    .attr('transform', 'translate(' + margin.left + ', 0)')
                    .call(d3.axisLeft().scale(data[analyteName]['yScale']).ticks(5));
            } else if (key == 1) {
                chart.append('g')
                    .attr('class', axisOrange)
                    .attr('transform', 'translate(' + (width - margin.right) + ', 0)')
                    .call(d3.axisRight().scale(data[analyteName]['yScale']).ticks(5));
            } else if (key == 2) {
                chart.append('g')
                    .attr('class', axisGreen)
                    .attr('transform', 'translate(' + (width - margin.right) + ', 0)')
                    .call(d3.axisLeft().scale(data[analyteName]['yScale']).ticks(5));
            } else if (key == 3) {
                chart.append('g')
                    .attr('class', axisPurple)
                    .attr('transform', 'translate(' + margin.left + ', 0)')
                    .call(d3.axisRight().scale(data[analyteName]['yScale']).ticks(5));
            }
        }

        // *** Draw reference (scoring) categories
        // Check that only one site is selected and has a y-max for the axis
        // Don't draw any reference elements if one or more analytes are selected
        // Revisit later and change if we decide to draw multiple graphs (one for each analyte)
        if (analyteKeys.length === 1 && Object.keys(analyteYMax).includes(analyteKeys[0])) {
            const analyteName = analyteKeys[0];
            const yScale = data[analyteName]['yScale'];
            // Check that the analyte has a code within the app. The code is used to access the reference values stored in the file, constants.js.
            // If it doesn't have a code, skip and don't draw reference elements.
            if (analytes[analyteName]) {
                const categories = analyteScoringCategories[analytes[analyteName.code]];
                if (categories.length > 0) {
                    // Rectangles
                    const rects = categories.filter(d => d['type'] === 'area');
                    if (rects.length > 0) {
                        const rectGroup = chart.append('g')
                            .data(rects)
                            .attr('clip-path', 'url(#clip)');
                        rectGroup.selectAll('rect')
                            .data(rects)
                            .enter().append('rect')
                            .attr('width', width - margin.left - margin.right)
                            .attr('height', d => yScale(d.lowerValue) - yScale(d.upperValue))
                            .attr('x', 0 + margin.left)
                            .attr('y', d => yScale(d.upperValue))
                            .attr('fill', d => d['fillColor'])
                            .attr('opacity', 0.25);
                        rectGroup.selectAll('text')
                            .data(rects)
                            .enter().append('text')
                            .attr('x', width - margin.right - 5)
                            .attr('y', d => yScale(d.lowerValue) - 5)
                            .attr('font-size', '11px')
                            .attr('text-anchor', 'end')
                            .text(d => d.label);
                    }
                }
            }
        }
        /*
        const geometries = analyteScoringCategories[analytes[analyte]['code']] || [];
        if (geometries.length > 0) {
            const rects = geometries.filter(d => d['type'] === 'area');
            if (rects.length > 0) {
                const rectGroup = chart.append('g')
                    .data(rects)
                    .attr('clip-path', 'url(#clip)');
                rectGroup.selectAll('rect')
                    .data(rects)
                    .enter().append('rect')
                    .attr('width', width - margin.left - margin.right)
                    .attr('height', d => yScale(d.lowerValue) - yScale(d.upperValue))
                    .attr('x', 0 + margin.left)
                    .attr('y', d => yScale(d.upperValue))
                    .attr('fill', d => d['fillColor'])
                    .attr('opacity', 0.25);
                rectGroup.selectAll('text')
                    .data(rects)
                    .enter().append('text')
                    .attr('x', width - margin.right - 5)
                    .attr('y', d => yScale(d.lowerValue) - 5)
                    .attr('font-size', '11px')
                    .attr('text-anchor', 'end')
                    .text(d => d.label);
            }
        }
        */


        for (const key in analyteKeys) {
            const analyteName = analyteKeys[key];
            const yScale = data[analyteName]['yScale'];

            /*
            // draw lines
            const line = d3.line()
                .x(function(d) { return xScale(d.SampleDate); })
                .y(function(d) { return yScale(d.Result); })
                .curve(d3.curveMonotoneX); // apply smoothing to line
            chart.append('path')
                .datum(data[analyteName]['data'])
                .attr('class', 'line')
                .attr('d', line)
                .attr('stroke', colorPaletteViz[key])
                .attr('fill', 'none')
                .attr('stroke-width', 1);
            */

            // draw points
            const points = chart.append('g')
                .attr('clip-path', 'url(#clip)');
            points.selectAll('.circle')
                .data(data[analyteName]['data'])
                .enter().append('circle')
                .attr('class', 'circle')
                .attr('r', 4)
                .attr('cx', d => xScale(d.SampleDate))
                .attr('cy', d => yScale(d.ResultDisplay))
                .attr('fill', d => d.NonDetect ? '#e3e4e6' : colorPaletteViz[key])
                .attr('stroke', d => d.NonDetect ? colorPaletteViz[key] : '#fff')
                .attr('stroke-width', d => d.NonDetect ? 2 : 1)
                .attr('stroke-dasharray', d => d.NonDetect ? ('2,1') : 0)
                .on('mouseover', function(currentEvent, d) {
                    let content = '<span style="color: #a6a6a6">' + formatDate(d.SampleDate) + '</span><br>' + d.Analyte + ": " + formatNumber(d.ResultDisplay) + ' ' + d.Unit;
                    if (d.NonDetect) {
                        content += '<br><i>Non-detect</i>';
                    }
                    return tooltip
                        .style('opacity', 1)
                        .style('left', (currentEvent.pageX) + 'px')
                        .style('top', (currentEvent.pageY - 28) + 'px')
                        .html(content);
                })
                .on('mousemove', function(currentEvent, d) {
                    return tooltip
                        .style('opacity', 1)
                        .style('left', (currentEvent.pageX) + 'px')
                        .style('top', (currentEvent.pageY - 28) + 'px');
                })
                .on('mouseout', () => {
                    return tooltip.style('opacity', 0);
                })
                .merge(points)
                .attr('cx', d => xScale(d.SampleDate))
                .attr('cy', d => yScale(d.ResultDisplay));
            points.exit()
                .remove();
        }

        // *** Add legend
        // Append unit to end of analyte name
        const analytesWithUnit = analyteKeys.map(analyte => {
            if (data[analyte].unit === '') {
                return analyte;
            } else {
                return `${analyte} (${data[analyte].unit})`;
            }
        });
        const svgLegend = d3.select('#station-legend-container').append('svg')
            .attr('width', 300)
            .attr('height', 28 * selectedAnalytes.length);
        svgLegend.append('g')
            .attr('class', 'legendOrdinal')
            .attr('transform', 'translate(20, 10)');
        const ordinal = d3.scaleOrdinal()
            .domain(analytesWithUnit)
            .range(colorPaletteViz);
        const legendOrdinal = legendColor()
            //d3 symbol creates a path-string, for example
            //"M0,-8.059274488676564L9.306048591020996,
            //8.059274488676564 -9.306048591020996,8.059274488676564Z"
            .shape('path', d3.symbol().type(d3.symbolCircle).size(100)())
            .shapePadding(8)
            //use cellFilter to hide the "e" cell
            .cellFilter(function(d){ return d.label !== 'e' })
            .scale(ordinal)
            .orient('vertical')
            //.labelWrap(80)
            //.labelAlign('middle');
        svgLegend.select('.legendOrdinal')
            .call(legendOrdinal);
    };


    const handleClick = () => {
        if (modalVisible === false) {
            setLoading(true);
            setModalVisible(true);
        }
    }

    // Because onOpen is not working for as expected, use useEffect to initiate getting the data
    useEffect(() => {
        if (modalVisible) {
            if (data) { setData(null) };
            // Limit number of sites graphed to 4
            let vizParameters;
            if (selectedAnalytes.length > 4) {
                vizParameters = selectedAnalytes.slice(0, 4);
            } else {
                vizParameters = selectedAnalytes;
            }
            const promises = [];
            for (let i = 0; i < vizParameters.length; i++) {
                promises.push(getData(vizParameters[i], station));
            }
            Promise.all(promises)
                .then((results) => {
                    console.log(results);
                    let analyteData = {};
                    for (let i = 0; i < results.length; i++) {
                        const analyte = results[i][0].Analyte;
                        const unit = results[i][0].Unit;  // Get unit for displaying in the legend
                        const data = results[i];
                        analyteData[analyte] = { 
                            data: data,
                            unit: unit
                        };
                    }
                    setData(analyteData);
                });
        }
    }, [modalVisible]);

    useEffect(() => {
        if (data) {
            setLoading(false);
        }
    }, [data])

    useEffect(() => {
        if (!loading) {
            drawChart();
        }
    }, [loading]);

    const getData = (parameter) => {
        return new Promise((resolve, reject) => {
            let url;
            // Get Habitat data
            if (habitatAnalytes.includes(parameter)) {
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=9ce012e2-5fd3-4372-a4dd-63294b0ce0f6&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + parameter + '%22}&sort=%22SampleDate%22%20desc';
                //url += '&fields=StationCode,Analyte,SampleDate,Result,Unit';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.ResultDisplay = +parseFloat(d.Result).toFixed(2);
                        d.NonDetect = false;
                        if (parameter === 'CSCI') {
                            d.Unit = 'score';
                        }
                    });
                    resolve(records);
                });
            } else {
                // Get chemistry data
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + parameter + '%22}&sort=%22SampleDate%22%20desc';
                //url += '&fields=StationCode,Analyte,SampleDate,Result,Unit,NonDetect,ResultDisplay';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.Result = +d.Result.toFixed(2);
                        d.ResultDisplay = +d.ResultDisplay.toFixed(2);
                        d['NonDetect'] = d['NonDetect'].toLowerCase() === 'true';  // Convert string to boolean
                        if (parameter === 'pH') {
                            d.Unit = '';
                        }
                    });
                    resolve(records);
                });
            }
        });
    }

    return (
        <div>
            <Button 
                className={rowButton}
                compact 
                size='tiny'
                disabled={selectedAnalytes.length < 1}
                onClick={handleClick} 
                onKeyPress={handleClick}
            >
                <Icon name='chart bar' />
                Graph data for selected indicators {selectedAnalytes.length > 0 ? `(${selectedAnalytes.length})` : '(0)' }
            </Button>
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                >
                    <Header icon='chart bar' content={`${station} - ${stationName}`} />
                    <Modal.Content>
                        { loading ? 'Loading...' : 
                            <div className={modalContent}>
                                <div className={downloadWrapper}>
                                    <Button>Test</Button>
                                </div>
                                <div id="station-chart-container"></div>
                                <div className={chartFooter}>
                                    <div id="station-legend-container" className={legendContainer}></div>
                                    <div className={analyteSection}>
                                        { selectedAnalytes.length === 1 ? 
                                            // If one analyte is selected, display the card
                                            <AnalyteCard analyte={selectedAnalytes[0]} /> 
                                            // If more than one analyte, build a grid
                                            : <AnalyteIconGrid selectedAnalytes={selectedAnalytes} />
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </Modal.Content>
                </Modal> 
            : '' }
        </div>
    )
}