import React, { useEffect, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { customTooltip, axisLabel, lineLabel } from './time-series.module.css';


export default function TimeSeries({ data, trend }) {
    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    
    const getColor = (d, objective) => {
        const red = '#e84141';
        const blue = '#0071BC';
        const gray = '#4d5e6b';
        if (objective) {
            switch (objective.type) {
                case 'max': 
                    if (d.Result > objective.value) {
                        return red;
                    } else {
                        return blue;
                    }
                case 'min':
                    if (d.Result < objective.value) {
                        return red;
                    } else {
                        return blue;
                    }
                case 'range':
                    if ((d.Result >= objective.lower) && (d.Result <= objective.upper)) {
                        return blue;
                    } else {
                        return red;
                    }
                default:
                    return gray;
            }
        } else {
            return gray;
        }
    }

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

    const drawChart = useCallback(() => {
        //const analyte = data[0].Analyte;
        const unit = data[0].Unit;

        // filter out "NaN values"
        const results = data.map(d => d.Result);

        // calculate average for placeholder threshold line
        const avgResult = Math.floor(results.reduce((a, b) => a + b) / results.length);
        const objective = {
            type: 'max',
            label: 'Objective',
            value: avgResult,
            unit: unit,
            upper: null,
            lower: null
        }

        const chartId = 'chart-' + randomId.current;
        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const width = 650 + margin.left + margin.right;
        const height = 180 + margin.top + margin.bottom;
        const clipPadding = 4;

        const chart = d3.select('#container-' + randomId.current).append('svg')
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
        // add tooltip
        /*
        const tooltip = d3.select('body').append('div')
            .attr('id', randomId.current + '-tooltip')
            .attr('class', customTooltip)
            .style('opacity', 0);
        */
       const tooltip = d3.select('#chartTooltip')
        .attr('class', customTooltip)
        .style('opacity', 0);

        // initialize axes
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (height - margin.bottom) + ')');
        chart.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + margin.left + ', 0)');
        const xExtent = d3.extent(data, (d) => { return d.parsedDate; });
        const yMax = d3.max(data, (d) => { return d.Result; });
        const xScale = d3.scaleTime()
            .domain(xExtent)
            .range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([height - margin.bottom, margin.top]);
        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);
        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        // draw objective line
        if (objective) {
            if (objective.type === 'max' || objective.type === 'min') {
                const objLine = chart.append('g')
                    .datum(objective)
                    .attr('clip-path', 'url(#clean-clip)');
                objLine.append('line')
                    .attr('className', 'objective')
                    .style('stroke', '#e74c3c')
                    .style('stroke-width', '2px')
                    //.attr('stroke-dasharray', ('9, 3'))
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', (d) => { return yScale(d.value); })
                    .attr('y2', (d) => { return yScale(d.value); });
                objLine.append('text')
                    .attr('class', lineLabel)
                    .attr('x', margin.left + 'px')
                    .attr('y', (d) => { return yScale(d.value); })
                    .attr('transform', 'translate(5, -5)')
                    .attr('text-anchor', 'left')
                    .text((d) => { return d.label + ': ' + d.value + ' ' + d.unit; });
            }
        }

        // draw points
        const points = chart.append('g')
            .attr('clip-path', 'url(#clip)');
        points.selectAll('.circle')
            .data(data)
            .enter().append('circle')
            .attr('className', 'circle')
            .attr('r', 4)
            .attr('cx', (d) => { 
                return xScale(d.parsedDate); 
            })
            .attr('cy', (d) => { return yScale(d.Result); })
            .attr('fill', (d) => { return getColor(d, objective); })
            .on('mouseover', function(event, d) {
                const formatDate = d3.timeFormat('%b %e, %Y');
                return tooltip
                    .style('opacity', 1)
                    .html('<span style="color: #a6a6a6">' + formatDate(d.parsedDate) + '</span><br>' + d.Analyte + ": " + d.Result + ' ' + d.Unit);
            })
            .on('mousemove', () => {
                return tooltip
                    .style('top', (window.event.pageY - 50) + 'px')
                    .style('left', (window.event.pageX - 100) + 'px');
            })
            .on('mouseout', () => {
                return tooltip.style('opacity', 0);
            })
            .merge(points)
            .attr('cx', (d) => { return xScale(d.parsedDate); })
            .attr('cy', (d) => { return yScale(d.Result); });
        points.exit()
            .remove();

        
        // draw trend line
        if (trend) {
            if (trend.trend === 'Increasing' || trend.trend === 'Decreasing') {
                const y2 = trend.intercept + (data.length * trend.slope);
                const trendValues = [xExtent[0], trend.intercept, xExtent[1], y2];
                const trendLine = chart.append('g')
                    .datum(trendValues)
                    .attr('clip-path', 'url(#clean-clip)');
                trendLine.append('line')
                    .attr('className', 'trendLine')
                    .style('stroke', '#000')
                    .style('stroke-width', '2px')
                    .attr('stroke-dasharray', ('9, 3'))
                    .attr('x1', (d) => { return xScale(d[0]) })
                    .attr('y1', (d) => { return yScale(d[1]) })
                    .attr('x2', (d) => { return xScale(d[2]) })
                    .attr('y2', (d) => { return yScale(d[3]) });
            }
        }


        // draw axes
        chart.select('.x.axis').call(xAxis);
        chart.select('.y.axis').call(yAxis);
        chart.append('text')
            .attr('class', axisLabel)
            .attr('text-anchor', 'middle')  
            .attr('transform', 'translate(' + 12 + "," + (height / 2) + ') rotate(-90)')
            .text(unit);
    }, [data, trend]);

    useEffect(() => {
        drawChart();
    }, [drawChart])
    
    return (
        <div id={'container-' + randomId.current}></div>
    )
}