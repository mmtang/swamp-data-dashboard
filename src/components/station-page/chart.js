import React, { useState, useEffect } from 'react';
import LoaderBlock from '../loaders/loader-block';

import * as d3 from 'd3';
import { colorPaletteViz } from '../../constants/constants-app';
import { toxColors } from '../../constants/constants-app';
import { analytes, analyteScoringCategories, analyteYMax, toxicitySigValues  } from '../../constants/constants-data';

import { chart, chartContainer, customTooltip } from './chart.module.css';

export default function Chart({ analyte, data, dateExtent, unit }) {
    const [loading, setLoading] = useState(true);

    const axisFormatDate = d3.timeFormat('%m/%d/%Y');
    const axisFormatDateYear = d3.timeFormat('%Y');
    const tooltipFormatDate = d3.timeFormat('%b %e, %Y');
    const yearFormatDate = d3.timeFormat('%Y');
    const formatNumber = d3.format(',');

    // Generate random 6 digit integer to serve as ID for this chart instance
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const chartId = `chart-${randomId}`;

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
        const margin = { top: 30, right: 40, bottom: 65, left: 67 };
        // get container + svg aspect ratio
        const container = d3.select('#' + chartId).node();
        const targetWidth = parseInt(container.getBoundingClientRect().width);
        const width = targetWidth;
        const height = 220 + margin.top + margin.bottom;
        const clipPadding = 5;

        const chart = d3.select('#' + chartId).append('svg')
            .attr('id', chartId + '-svg')
            .attr('className', 'chart')
            .attr('width', width)
            .attr('height', height)
            .call(() => { responsive(chartId + '-svg'); });
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

        // Initialize tooltip
        const tooltip = d3.select('body').append('div')
            .attr('id', `tooltip-${randomId}`)
            .attr('class', customTooltip)
            .style('opacity', 0);

        // Define x scale
        const xScale = d3.scaleTime()
            .domain(dateExtent)
            .range([margin.left, width - margin.right]);

        // Define y scale
        let yMax;
        // For analytes with percent unit, fix y-axis to 0-100
        // For some analytes with scoring categories or thresholds (see analyteYMax dictionary), we will want to use a pre-determined max
        if (unit === '%') {
            yMax = 100;
        } else if (Object.keys(analyteYMax).includes(analyte)) {
            yMax = analyteYMax[analyte];
        } else {
            const results = data.map(d => d.ResultDisplay);
            yMax = d3.max(results);
        }
        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([height - margin.bottom, margin.top]);
        
        // Draw x-axis
        // Limit number of ticks based on width of chart (screen size)
        const numTicks = targetWidth < 600 ? 5 : null;
        
        // Check multiple criteria to see if the x-axis should be formatted as year or as the full date
        const formatAsYear = (((data.length > 1) && (dateExtent[0] !== dateExtent[1])) && ((dateExtent[0].getYear() !== dateExtent[1].getYear()) || (analyte.source === 'tissue')));

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(numTicks)
            .tickFormat(formatAsYear ? axisFormatDateYear : axisFormatDate);
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
        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);
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
            /*
            .append('text') // Add y-axis label (unit) on inside of y-axis
                .attr('transform', 'rotate(-90)')
                .attr('dy', '0.75em')
                .attr('x' , 0 - margin.top)
                .attr('y', 6)
                .style('fill', '#5d5d5d')
                .style('font-size', '12px')
                .style('text-anchor', 'end')
                .text(unit);
            */

        // Restyle axis text elements
        d3.selectAll('.axis > .tick > text')
            .style('font-size', '1.3em')
            .style('font-family', 'Source Sans Pro');

        // Draw reference geometries
        // Check that reference values exist
        if (analytes[analyte]) {
            if (Object.keys(analyteScoringCategories).includes(analytes[analyte].code)) {
                // Get reference values
                const categories = analyteScoringCategories[analytes[analyte].code];
                if (categories.length > 0) {
                    // Rectangles (area graphs)
                    const rects = categories.filter(d => d['type'] === 'area');
                    if (rects.length > 0) {
                        const rectGroup = chart.append('g')
                            .data(rects)
                            .attr('clip-path', 'url(#clip)');
                        rectGroup.selectAll('rect')
                            .data(rects)
                            .enter().append('rect')
                            .attr('width', width - margin.left - margin.right)
                            .attr('height', d => {
                                return yScale(d.lowerValue) - yScale(d.upperValue);
                            })
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
        }

        // Draw points
        const points = chart.append('g');
        points.selectAll('.circle')
            .data(data)
            .enter().append('circle')
            .attr('class', 'circle')
            .attr('r', 5)
            .attr('cx', d => xScale(d.SampleDate))
            .attr('cy', d => yScale(d.ResultDisplay))
            .attr('fill', d=> {
                if (d.SigEffectCode) {
                    if (toxicitySigValues.includes(d.SigEffectCode)) {
                        return toxColors.darkRed;
                    } else {
                        return toxColors.darkBlue;
                    }
                } else {
                    return d.Censored ? '#e3e4e6' : colorPaletteViz[0];
                }
            })
            .attr('stroke', d => d.Censored ? colorPaletteViz[0] : '#fff')
            .attr('stroke-width', d => d.Censored ? 2 : 1)
            .attr('stroke-dasharray', d => d.Censored ? ('2,1') : 0)
            .on('mouseover', function(currentEvent, d) {
                const displayDate = d.MatrixDisplay !== 'tissue' ? tooltipFormatDate(d.SampleDate) : yearFormatDate(d.SampleDate);
                let content = '<span style="color: #a6a6a6">' + displayDate + '</span><br>' + d.Analyte + ": ";
                if (['<', '>', '<=', '>='].includes(d.DisplayText)) {
                    content += d.DisplayText + ' ';
                }
                content += formatNumber(d.ResultDisplay) + ' ' + d.Unit;
                if (d.Species) {
                    content += '<br>' + d.Species;
                    if (d.MatrixDisplay === 'tissue') {
                        content += ` (${d.TissuePrep})`;
                    }
                }
                if (d.MatrixDisplay === 'tissue') {
                    content += '<br>' + d.ResultType;
                }
                if (d.SigEffectCode && toxicitySigValues.includes(d.SigEffectCode)) {
                    content += '<br>Likely toxic';
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

        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        if (data && dateExtent) {
            drawChart();
        }
    }, [data])

    return (
        <div className={chartContainer}>
            { loading ? <LoaderBlock /> : null }
            <div id={chartId} className={chart} />
        </div>
    )
}