import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { analytes, analyteScoringCategories, analyteYMax } from '../../constants/constants-data';
import { customTooltip, modalContent } from './chart-panel.module.css';

// Component for rendering graph on the dashboard index page (station panel) for toxicity and tissue data
export default function ChartSpecies({ analyte, data, unit, vizColors }) {
    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    const speciesColorDict = useRef(null);
    const axisFormatDate = d3.timeFormat('%m/%d/%Y');
    const axisFormatDateYear = d3.timeFormat('%Y');
    const tooltipFormatDate = d3.timeFormat('%b %e, %Y');
    const yearFormatDate = d3.timeFormat('%Y');
    const formatNumber = d3.format(',');

    const divContainer = '#index-chart-species-container';
    const divLegend = '#index-chart-legend';
    const siteKeys = Object.keys(data.sites);

    const margin = { top: 35, right: 20, bottom: 60, left: 55 };

    // Instantiate this variable if only one site has been selected; otherwise set speciesColorDict to null
    // If displaying multiple species, we need to preassign the species values to colors first
    const mapColorsToSpecies = (data) => {
        return new Promise((resolve, reject) => {
            if (data && siteKeys.length === 1) {
                const siteData = data.sites[siteKeys[0]];
                const allSpecies = (siteData.map(d => d.Species));
                const uniqueSpecies = [...new Set(allSpecies),];
                // Initialize new dictionary to store species:color pairs
                const speciesDict = {};
                for (let i = 0; i < uniqueSpecies.length; i++) {
                    speciesDict[uniqueSpecies[i]] = vizColors[i];
                }
                resolve(speciesDict);
            } else {
                resolve({}); // Set to an empty dictionary instead of null so that speciesColorDict.current can still be accessed and not throw an error. This is needed for the part of the code that draws the points
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
                const width = targetWidth;
                const height = 220 + margin.top + margin.bottom;
                const clipPadding = 5;
                // Remove old svg elements
                d3.select('.chart').remove();
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
                const formatAsYear = (((countResults > 1) && (xExtent[0] != xExtent[1])) && (xExtent[0].getYear() !== xExtent[1].getYear()) || data.analyte.source === 'tissue' );

                // Define x-axis
                const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(numTicks)
                    .tickFormat(formatAsYear ? axisFormatDateYear : axisFormatDate);

                // ** Calculate y-axis max
                // For toxicity, fix y-axis to 0-100
                // For some analytes (see analyteYMax dictionary in constants), we will use a pre-determined max
                // For everything else, use the max result value
                let yMax;
                if (analyte.source === 'toxicity') {
                    yMax = 100;
                } else if (Object.keys(analyteYMax).includes(analyte.label)) {
                    yMax = analyteYMax[analyte.label];
                } else {
                    let allResults = [];
                    for (let i = 0; i < siteKeys.length; i++) {
                        const results = data.sites[siteKeys[i]].map(d => d.ResultDisplay);
                        allResults = [...allResults, ...results];
                    }
                    yMax = d3.max(allResults);
                }

                const yScale = d3.scaleLinear()
                    .domain([0, yMax])
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
                                .attr('opacity', 0.25);
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

                // Loops through each site and draw lines + points
                for (let i = 0; i < siteKeys.length; i++) {
                    // Add points
                    const points = chart.append('g')
                        .attr('clip-path', 'url(#clip)');
                    points.selectAll('.circle')
                        .data(data.sites[siteKeys[i]])
                        .enter().append('circle')
                        .attr('class', 'circle')
                        .attr('r', 4)
                        .attr('cx', d => xScale(d.SampleDate))
                        .attr('cy', d => yScale(d.ResultDisplay))
                        .attr('fill', d => d.Censored ? '#e3e4e6' : speciesColorDict.current[d.Species] || vizColors[i] ) // If drawing one site, use the assigned species color; if drawing multiple sites, use the vizColor array
                        .attr('stroke', d => d.Censored ? speciesColorDict.current[d.Species] || vizColors[i] : '#fff')
                        .attr('stroke-width', d => d.Censored ? 2 : 1)
                        .attr('stroke-dasharray', d => d.Censored ? ('2,1') : 0)
                        .on('mouseover', function(currentEvent, d) {
                            const displayDate = analyte.source !== 'tissue' ? tooltipFormatDate(d.SampleDate) : yearFormatDate(d.SampleDate);
                            let content = '<span style="color: #a6a6a6">' + displayDate + '</span><br>' + d.Analyte + ": ";
                            if (['<', '>', '>=', '<='].includes(d.DisplayText)) {
                                content += d.ResultQualCode + ' ';
                            }
                            content += formatNumber(d.ResultDisplay) + ' ' + d.Unit;
                            if (d.Species) {
                                content += '<br>' + d.Species;
                            }
                            if (d.DisplayText) {
                                // Look for values of greater than 2 to exclude values like '<' and '<='
                                if (d.DisplayText.length > 2) {
                                    content += '<br><i>* ' + d.DisplayText + '</i>';
                                }
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
            }
        };

        const drawLegend = (speciesColorDict) => {
            if (speciesColorDict && speciesColorDict.current) {
                // Remove old legend elements
                d3.select('.legend').remove();
                // Get species values and sort by alphabetical order
                const species = Object.keys(speciesColorDict.current).sort((a, b) => a.localeCompare(b));
                // Create accompany array with matching colors
                const colors = species.map(d => speciesColorDict.current[d]);
                const legendColor = d3.scaleOrdinal(colors).domain(species);
                // Draw legend
                const svg = d3.select(divLegend).append('svg')
                    .attr('class', 'legend')
                    .attr('width', '100%')
                    .attr('height', species.length * 18)
                    .style('font', '0.8em Source Sans Pro');
                const legend = svg.append('g')
                    .selectAll('g')
                    .data(species)
                    .join('g')
                    .attr('transform', (d, i) => `translate(0, ${i * 18})`);
                legend.append('rect')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('fill', d => legendColor(d));
                legend.append('text')
                    .attr('x', 24)
                    .attr('y', 9)
                    .attr('text-anchor', 'start')
                    .attr('dy', '0.35em')
                    .text(d => d);
            }
        }

        if (data) {
            mapColorsToSpecies(data)
            .then((res) => {
                speciesColorDict.current = res;
                drawChart(data);
                drawLegend(speciesColorDict);
            });
        }
    }, [data])
    
    return (
        <div className={modalContent}>
            <div id="index-chart-species-container"></div>
            <div id="index-chart-legend"></div>
        </div>
    );
}