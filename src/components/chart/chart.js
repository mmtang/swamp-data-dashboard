import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { analytes, analyteScoringCategories, analyteYMax } from '../../constants/constants-data';
import { getCsciCategoryValue, roundAsNeeded } from '../../utils/utils';
import { customTooltip, modalContent } from './chart-panel.module.css';

// Component for rendering graph on the dashboard index page (station panel)
export default function Chart({ analyte, data, setSiteShapeDict, unit, vizColors }) {
    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    const siteShapeDictRef = useRef(null);
    const axisFormatDate = d3.timeFormat('%-m/%-d/%Y');
    const axisFormatDateYear = d3.timeFormat('%Y');
    const tooltipFormatDate = d3.timeFormat('%b %e, %Y');
    const formatNumber = d3.format(',');
    const shapePaletteViz = [d3.symbolCircle, d3.symbolTriangle, d3.symbolSquare, d3.symbolDiamond, d3.symbolCross];

    const divContainer = '#index-chart-container';

    const mapSitesToShapes = (data) => {
        return new Promise((resolve, reject) => {
            if (data) {
                const siteKeys = Object.keys(data.sites);
                // Initialize new dictionary to store site:shape pairs
                const siteDict = {};
                for (let i = 0; i < siteKeys.length; i++) {
                    siteDict[siteKeys[i]] = shapePaletteViz[i];
                }
                resolve(siteDict);
            } else {
                resolve({}); // Set to an empty dictionary instead of null so that siteShapeDict.current can still be accessed and not throw an error. This is needed for the part of the code that draws the points
            }
        })
    }

    useEffect(() => {
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

        const drawChart = (data) => {
            // get container + svg aspect ratio
            const container = d3.select(divContainer).node();
            // check that container is not null before accessing properties and drawing chart
            // this can happen on multiple renders
            if (container !== null) {
                const targetWidth = parseInt(container.getBoundingClientRect().width);
                const chartId = 'chart-' + randomId.current;
                const margin = { top: 35, right: 20, bottom: 60, left: 55 };
                const width = targetWidth;
                const height = 220 + margin.top + margin.bottom;
                const clipPadding = 5;
                // Remove old svg elements
                d3.select('.chart').remove();
                d3.select('.legend').remove();
                d3.select('#index-chart-tooltip').remove();

                const chart = d3.select(divContainer).append('svg')
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
                    .attr('id', 'index-chart-tooltip')
                    .attr('class', customTooltip)
                    .style('opacity', 0);
                
                // --- Define scales
                const siteKeys = Object.keys(data.sites);

                // Get sample dates from all sites to define domain for x-axis
                let allDates = [];
                for (let i = 0; i < siteKeys.length; i++) {
                    const dates = data.sites[siteKeys[i]].map(d => d.SampleDate);
                    allDates = [...allDates, ...dates];
                }
                const xExtent = d3.extent(allDates);
                const xScale = d3.scaleTime()
                    .domain(xExtent)
                    .range([margin.left, width - margin.right]);

                // Limit number of ticks based on width of chart (screen size)
                const numTicks = targetWidth < 600 ? 4 : null;

                // Calculate number of data points across all selected sites
                let countResults = 0;
                for (let i = 0; i < siteKeys.length; i++) {
                    countResults += data.sites[siteKeys[i]].length;
                }
                
                // Check multiple criteria to see if the x-axis should be formatted as year or as the full date
                const formatAsYear = (countResults > 1 || data.analyte.source === 'tissue') && (xExtent[0].getYear() !== xExtent[1].getYear());

                // Define x-axis
                const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(numTicks)
                    .tickFormat(formatAsYear ? axisFormatDateYear : axisFormatDate);

                // ** Calculate y-axis max
                // For analytes with percent unit, fix y-axis to 0-100
                // For some analytes (see analyteYMax dictionary in constants), we will use a pre-determined max
                // For everything else, use the max result value
                let allResults = [];
                for (let i = 0; i < siteKeys.length; i++) {
                    const results = data.sites[siteKeys[i]].map(d => d.ResultDisplay);
                    allResults = [...allResults, ...results];
                }

                let yMax;
                if (analyte.unit === '%') {
                    yMax = 100;
                } else if (Object.keys(analyteYMax).includes(analyte.label)) {
                    yMax = analyteYMax[analyte.label];
                } else if (allResults.every(d => d === 0)) {
                    // If every result is 0, then assign the yMax as 10 (arbitrary number) so that the zero data points are drawn at the bottom of the graph instead of the middle
                    yMax = 10;
                } else {
                    yMax = d3.max(allResults);
                }

                // ** Calculate y-axis min
                // Check if there is a value below zero. If all values are above zero, then set zero as the min. Otherwise, set the lowest value as the min.
                let yMin;
                if (allResults.some(d => d < 0)) {
                    yMin = d3.min(allResults);
                } else {
                    yMin = 0;
                }

                

                const yScale = d3.scaleLinear()
                    .domain([yMin, yMax])
                    .range([height - margin.bottom, margin.top]);

                // Define y-axis
                const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(6);

                // Draw x-axis
                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                    .call(xAxis)
                    // Rotate axis labels
                    .selectAll('text')
                        .style('text-anchor', 'end')
                        .attr('dx', -8)
                        .attr('dy', 6)
                        .attr('transform', 'rotate(-40)');
        
                // Draw y-axis
                chart.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(' + margin.left + ', 0)')
                    .call(yAxis)
                    .append('text') // Add y-axis label (unit) on top of y-axis
                        .attr('dy', '0.75em')
                        .attr('x' , 0 - margin.left + 5) // Position text at the very left edge of the graph + 5 pixels right
                        .attr('y', 6)
                        .style('fill', '#5d5d5d')
                        .style('font-size', '12px')
                        .style('text-anchor', 'start')
                        .text(unit);

                // Restyle axis text elements
                d3.selectAll('.axis > .tick > text')
                    .style('font-size', '1.3em')
                    .style('font-family', 'Source Sans Pro');

                // Draw reference geometries (scoring categories)
                if (analytes[analyte.label]) {
                    const geometries = analyteScoringCategories[analytes[analyte.label]['code']] || [];
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
                                .attr('opacity', 0.8);
                            rectGroup.selectAll('text')
                                .data(rects)
                                .enter().append('text')
                                .attr('x', width - margin.right - 5)
                                .attr('y', d => yScale(d.lowerValue) - 5)
                                .attr('font-family', 'Source Sans Pro')
                                .attr('font-size', '11px')
                                .attr('text-anchor', 'end')
                                .text(d => d.label);
                        }
                    }
                }

                /* 
                // 11/14/22 - Changed lines + points to just lines
                // Commented out for reference and for if we decide to add the lines back
                const resultLine = d3.line()
                    .x(d => xScale(d.SampleDate))
                    .y(d => yScale(d.ResultDisplay))
                    //.curve(d3.curveMonotoneX) // apply smoothing to the line
                */
            
                // Loops through each site and draw lines + points
                for (let i = 0; i < siteKeys.length; i++) {
                    /*
                    // Draw lines
                    const lines = chart.append('g');
                        //.attr('clip-path', 'url(#clip)');
                    lines.selectAll('.line')
                        .data(data.sites[siteKeys[i]])
                        .enter().append('path')
                        .attr('class', 'line ' + siteKeys[i])
                        .attr('fill', 'none')
                        .attr('stroke', d => vizColors[i])
                        .attr('stroke-width', 1.5)
                        .attr('d', resultLine(data.sites[siteKeys[i]])) // When using d3-selection, have to use line(data) method of getting data, https://observablehq.com/@d3/d3-line
                        .merge(lines)
                        .attr('d', resultLine(data.sites[siteKeys[i]]))
                    lines.exit()
                        .remove();
                    */

                    // Add points
                    const symbol = d3.symbol().type(siteShapeDictRef.current[siteKeys[i]]).size(80);

                    const points = chart.append('g');
                    points.selectAll('.symbol')
                        .data(data.sites[siteKeys[i]])
                        .enter()
                        .append('path')
                        .attr('class', 'symbol')
                        //.attr('r', 5)
                        //.attr('cx', d => xScale(d.SampleDate))
                        //.attr('cy', d => yScale(d.ResultDisplay))
                        .attr('d', symbol)
                        .attr('transform', d => `translate(${xScale(d.SampleDate)}, ${yScale(d.ResultDisplay)})`)
                        //.attr('fill', d => d.Censored ? '#e3e4e6' : vizColors[i])
                        .attr('fill', d => d.Censored ? '#e3e4e6' : vizColors[0])
                        .attr('stroke', d => d.Censored ? vizColors[0] : '#fff')
                        .attr('stroke-width', d => d.Censored ? 2 : 1)
                        .attr('stroke-dasharray', d => d.Censored ? ('2,1') : 0)
                        .on('mouseover', function(currentEvent, d) {
                            let content = '<b>' + tooltipFormatDate(d.SampleDate) + '</b><br>';
                            if (siteKeys.length > 1) {
                                content += '<span style="color: #ababab">' + d.StationName + '</span><br>'
                            }
                            content += d.Analyte + ': ' + formatNumber(roundAsNeeded(d.ResultDisplay)) + ' ' + d.Unit;
                            if (['<', '>', '>=', '<='].includes(d.DisplayText)) {
                                content += d.ResultQualCode + ' ';
                            }
                            if (d.DisplayText) {
                                // Look for values of greater than 2 to exclude values like '<' and '<='
                                if (d.DisplayText.length > 2) {
                                    content += '<br><i>*' + d.DisplayText + '</i>';
                                }
                            }
                            if (d.Analyte === 'California Stream Condition Index (CSCI)') {
                                content += '<br>' + getCsciCategoryValue(d, false);
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

                    /*
                    // Add labels to lines
                    lines.append('text')
                        .attr('class', 'series-label')
                        .data(data.sites[siteKeys[i]])
                        .attr('transform', d => {
                                return 'translate(' + (xScale(d.SampleDate) + 10)  
                                + ',' + (yScale(d.ResultDisplay) + 5 ) + ')';
                        })
                        .attr('x', 5)
                        .style('fill', vizColors[i])
                        .style('font-size', '0.83em')
                        .style('font-weight', 600)
                        .text(d => d.StationCode);
                    */
                }
            }
        };

        if (data) {
            Promise.all([
                mapSitesToShapes(data),
            ]).then((res) => {
                siteShapeDictRef.current = res[0];
                setSiteShapeDict(res[0]);
                drawChart(data);
            });
        }
    }, [data])
    
    return (
        <div className={modalContent}>
            <div id="index-chart-container"></div>
        </div>
    );
}