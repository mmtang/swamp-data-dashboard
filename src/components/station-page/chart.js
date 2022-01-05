import React, { useState, useEffect } from 'react';
import LoaderBlock from '../common/loader-block';
import * as d3 from 'd3';
import { analyteYMax, analyteScoringCategories, analytes } from '../../constants/constants-data';
import { colorPaletteViz } from '../../constants/constants-app';
import { chartContainer, customTooltip } from './chart.module.css';

export default function Chart({ analyte, data, dateExtent }) {
    const [loading, setLoading] = useState(true);

    const formatDate = d3.timeFormat('%b %e, %Y');
    const formatNumber = d3.format(',');
    const chartId = `chart-${analytes[analyte].code}`;

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
        const margin = { top: 20, right: 15, bottom: 30, left: 45 };
        const width = 645 + margin.left + margin.right;
        const height = 220 + margin.top + margin.bottom;
        const clipPadding = 4;

        const chart = d3.select('#' + chartId).append('svg')
            .attr('id', chartId)
            .attr('className', 'chart')
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
        // Initialize tooltip
        const tooltip = d3.select('body').append('div')
            .attr('id', `tooltip-${analytes[analyte].code}`)
            .attr('class', customTooltip)
            .style('opacity', 0);

        // Define x scale
        const xScale = d3.scaleTime()
            .domain(dateExtent)
            .range([margin.left, width - margin.right]);

        // Define y scale
        let yMax;
        // For some analytes with scoring categories or thresholds (see analyteYMax dictionary), we will want to use a pre-determined max
        if (Object.keys(analyteYMax).includes(analyte)) {
            yMax = analyteYMax[analyte];
        } else {
            const results = data.map(d => d.ResultDisplay);
            yMax = d3.max(results);
        }
        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([height - margin.bottom, margin.top]);
        
        // Draw x-axis
        const xAxis = d3.axisBottom()
            .scale(xScale);
        chart.append('g')
            .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
            .call(xAxis);
        
        // Draw y-axis
        const yAxis = d3.axisLeft()
            .scale(yScale);
        chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ', 0)')
        .call(yAxis);

        // Draw reference geometries
        if (Object.keys(analyteScoringCategories).includes(analytes[analyte].code)) {
            // Get reference values
            const categories = analyteScoringCategories[analytes[analyte].code];
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
                        .attr('height', d => {
                            //console.log(yScale(d.lowerValue) - yScale(d.upperValue));
                            return yScale(d.lowerValue) - yScale(d.upperValue);
                        })
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

        // Draw points
        const points = chart.append('g')
            .attr('clip-path', 'url(#clip)');
        points.selectAll('.circle')
            .data(data)
            .enter().append('circle')
            .attr('class', 'circle')
            .attr('r', 4)
            .attr('cx', d => xScale(d.SampleDate))
            .attr('cy', d => yScale(d.ResultDisplay))
            .attr('fill', d => d.NonDetect ? '#e3e4e6' : colorPaletteViz[0])
            .attr('stroke', d => d.NonDetect ? colorPaletteViz[0] : '#fff')
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
    };

    useEffect(() => {
        if (data && dateExtent) {
            setLoading(false);
            drawChart();
        }
    }, [data])

    return (
        <div className={chartContainer}>
            { loading ? <LoaderBlock /> : null }
            <div id={chartId} />
        </div>
    )
}