import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { analytes, analyteScoringCategories, analyteYMax } from '../../constants/constants-data';
import { customTooltip, modalContent } from './chart-panel.module.css';

// Component for rendering graph on the dashboard index page (station panel)
export default function ChartPanel({ analyte, data, unit, vizColors }) {
    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    const axisFormatDate = d3.timeFormat('%-m/%-d/%y');
    const tooltipFormatDate = d3.timeFormat('%b %e, %Y');
    const formatNumber = d3.format(',');

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
            const margin = { top: 25, right: 20, bottom: 30, left: 55 };
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
            const numTicks = targetWidth < 600 ? 4 : null;

            // Define x-axis
            const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(numTicks)
                .tickFormat(axisFormatDate);

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
                /*
                .selectAll('text') // rotate x-axis labels
                    .style('text-anchor', 'end')
                    .attr('dx', '-0.8em')
                    .attr('dy', '.15em')
                    .attr('transform', 'rotate(-45)');
                */
    
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
                        let content = '<span style="color: #a6a6a6">' + tooltipFormatDate(d.SampleDate) + '</span><br>' + d.Analyte + ": ";
                        if (['<', '>', '>=', '<='].includes(d.DisplayText)) {
                            content += d.ResultQualCode + ' ';
                        }
                        content += formatNumber(d.ResultDisplay) + ' ' + d.Unit;
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
        };

        if (data) {
            drawChart(data);
        }
    }, [data])
    
    return (
        <div className={modalContent}>
            <div id="index-chart-container"></div>
        </div>
    );
}