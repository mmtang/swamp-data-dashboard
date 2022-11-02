import React, { useState, useEffect, useRef } from 'react';
import AnalyteCard from '../map-controls/analyte-card';
import DownloadData from '../common/download-data';
import LoaderBlock from '../common/loader-block';
import MessageDismissible from '../common/message-dismissible';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { analytes, analyteScoringCategories, habitatAnalytes, analyteYMax, chemDataFields, habitatDataFields, dataQualityCategories  } from '../../constants/constants-data';
// import { colorPaletteViz } from '../../constants/constants-app';
import { buttonContainer, customTooltip, chartFooter, legendContainer, cardWrapper, modalContent, downloadWrapper } from './chart-index.module.css';

// Component for rendering graph on the dashboard index page (from map and dashboard)
export default function ChartPanel({ analyte, data, unit, vizColors }) {
    const [overSelectionLimit, setOverSelectionLimit] = useState(false);

    const limitRef = useRef(5); // Limit number of sites that can be graphed
    const unitRef = useRef(null);
    const siteDictRef = useRef({});

    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = d3.timeFormat('%b %e, %Y');
    const formatNumber = d3.format(',');

    /*
    const overLimitMessage = `A maximum of ${limitRef.current.toLocaleString()} stations can be graphed at one time. ${limitRef.current.toLocaleString()} of the ${selectedSites.length} stations you selected are graphed below.`;
    */

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
            const container = d3.select('#index-chart-container').node();
            const targetWidth = parseInt(container.getBoundingClientRect().width);

            const chartId = 'chart-' + randomId.current;
            const margin = { top: 20, right: 85, bottom: 30, left: 55 };
            //const width = 645 + margin.left + margin.right;
            //const height = 220 + margin.top + margin.bottom;
            const width = targetWidth;
            const height = 220 + margin.top + margin.bottom;
            const clipPadding = 5;

            // Remove old svg elements
            d3.select('.chart').remove();
            d3.select('.legend').remove();

            const chart = d3.select('#index-chart-container').append('svg')
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
            const numTicks = targetWidth < 600 ? 5 : null;

            // Define x-axis
            const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(numTicks);

            // Get results from all sites to define domain for y-axis
            let allResults = [];
            for (let i = 0; i < siteKeys.length; i++) {
                const results = data.sites[siteKeys[i]].map(d => d.ResultDisplay);
                allResults = [...allResults, ...results];
            }
            // Get max value
            // For some analytes (see analyteYMax dictionary), we will want to show the full range and will use a pre-determined max
            let yMax;
            if (Object.keys(analyteYMax).includes(analyte)) {
                yMax = analyteYMax[analyte];
            } else {
                yMax = d3.max(allResults);
            }
            const yScale = d3.scaleLinear()
                .domain([0, yMax])
                .range([height - margin.bottom, margin.top]);
            // Define y-axis
            const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

            // Draw x-axis
            chart.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                .call(xAxis);
    
            // Draw y-axis
            chart.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + margin.left + ', 0)')
                .call(yAxis)
                .append('text') // Add y-axis label (unit)
                .attr('transform', 'rotate(-90)')
                .attr('dy', '0.75em')
                .attr('x' , 0 - margin.top)
                .attr('y', 6)
                .style('fill', '#5d5d5d')
                .style('font-size', '12px')
                .style('text-anchor', 'end')
                .text(unit);

            // Restyle axis text elements
            d3.selectAll('.axis > .tick > text')
                .style('font-size', '1.3em')
                .style('font-family', 'Source Sans Pro');
            
            /* Taking this out and putting unit in the modal header (consistent with station charts)
            // Draw unit on top of y-axis
            chart.append('text')
                .attr('class', 'unitLabel')
                //.attr('x', 10)
                //.attr('y', margin.top / 2)
                .attr('transform', `translate(18, ${margin.top}) rotate(-90)`)
                .attr('font-size', '11px')
                .attr('fill', '#41464b')
                .attr('text-anchor', 'end')
                .text(unitRef.current);
            */

            /*
            // Draw reference geometries (scoring categories)
            if (analytes[analyte]) {
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
                            .attr('font-family', 'Source Sans Pro')
                            .attr('font-size', '11px')
                            .attr('text-anchor', 'end')
                            .text(d => d.label);
                    }
                }
            }
            */

            const resultLine = d3.line()
                .x(d => xScale(d.SampleDate))
                .y(d => yScale(d.ResultDisplay))
                //.curve(d3.curveMonotoneX) // apply smoothing to the line
        
            // Loops through each site and draw lines + points
            for (let i = 0; i < siteKeys.length; i++) {
                //console.log(data.sites[siteKeys[i]]);

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
                    .attr('fill', d => d.Censored ? '#e3e4e6' : vizColors[i])
                    .attr('stroke', d => d.Censored ? vizColors[i] : '#fff')
                    .attr('stroke-width', d => d.Censored ? 2 : 1)
                    .attr('stroke-dasharray', d => d.Censored ? ('2,1') : 0)
                    .on('mouseover', function(currentEvent, d) {
                        let content = '<span style="color: #a6a6a6">' + formatDate(d.SampleDate) + '</span><br>' + d.Analyte + ": ";
                        if (['<', '>', '<=', '>='].includes(d.ResultQualCode)) {
                            content += d.ResultQualCode + ' ';
                        }
                        content += formatNumber(d.ResultDisplay) + ' ' + d.Unit;
                        if (d.Censored) {
                            if (d.ResultQualCode === 'ND') {
                                content += '<br><i>Non-detect</i>';
                            } else if (d.ResultQualCode === 'DNQ') {
                                content += '<br><i>Detected not quantified</i>';
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
            }

            {/*
            // *** Legend
            // Combine site codes and names
            let legendLabels = [];
            for (let i = 0; i < siteKeys.length; i++) {
                //const combinedName = `${siteKeys[i]} (${siteDictRef.current[siteKeys[i]].name})`;
                //const shortenedName = combinedName.length > 40 ? combinedName.slice(0, 40) + '...' : combinedName
                const shortenedName = siteKeys[i];
                legendLabels.push(shortenedName);
            }
            // Add legend
            const svgLegend = d3.select('#index-legend-container').append('svg')
                .attr('class', 'legend')
                .attr('width', 350)
                .attr('height', 24 * siteKeys.length);
            svgLegend.append('g')
                .attr('class', 'legendOrdinal')
                .attr('transform', 'translate(10, 10)');
            const ordinal = d3.scaleOrdinal()
                .domain(legendLabels)
                .range(colorPaletteViz);
            const legendOrdinal = legendColor()
                //d3 symbol creates a path-string, for example
                //"M0,-8.059274488676564L9.306048591020996,
                //8.059274488676564 -9.306048591020996,8.059274488676564Z"
                .shape('path', d3.symbol().type(d3.symbolCircle).size(100)())
                .shapePadding(6)
                //use cellFilter to hide the "e" cell
                .cellFilter(function(d){ return d.label !== 'e' })
                .scale(ordinal)
                .orient('vertical')
                //.labelWrap(80)
                //.labelAlign('middle');
            svgLegend.select('.legendOrdinal')
                .call(legendOrdinal);
            */}
        };

        if (data) {
            drawChart(data);
        }
    }, [data])
    
    return (
        <div className={modalContent}>
            {/* Display message if user selects too many sites */}
            {/*
            { overSelectionLimit ? 
                <MessageDismissible color='red' message={overLimitMessage} /> 
            : null }
            */}
            <div id="index-chart-container"></div>
            {/*
            <div className={chartFooter}>
                <div id="index-legend-container" className={legendContainer}></div>
            </div>
            */}
        </div>
    );
}