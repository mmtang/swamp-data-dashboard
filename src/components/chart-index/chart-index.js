import React, { useState, useEffect, useRef } from 'react';
import HelpIcon from '../icons/help-icon';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { colorPaletteViz, habitatAnalytes, getCensored } from '../../utils/utils';
import { buttonContainer, customTooltip } from './chart-index.module.css';


export default function ChartIndex({ selectedSites, analyte }) {
    const [data, setData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const unitRef = useRef(null);
    const siteDictRef = useRef({});

    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S');

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
            let vizSites;
            if (selectedSites.length > 4) {
                vizSites = selectedSites.slice(0, 4);
            } else {
                vizSites = selectedSites;
            }
            const promises = [];
            for (let i = 0; i < vizSites.length; i++) {
                promises.push(getData(vizSites[i], analyte));
            }
            Promise.all(promises)
                .then((results) => {
                    const obj = {
                        analyte: analyte,
                        sites: {}
                    };
                    for (let i = 0; i < results.length; i++) {
                        const station = results[i][0].StationCode;
                        const data = results[i];
                        obj.sites[station] = data;
                    }
                    setData(obj);
                    unitRef.current = results[0][0].Unit;
                    setLoading(false);
                });
        }
    }, [modalVisible]);

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
            const chartId = 'chart-' + randomId.current;
            const margin = { top: 20, right: 40, bottom: 30, left: 40 };
            const width = 645 + margin.left + margin.right;
            const height = 220 + margin.top + margin.bottom;
            const clipPadding = 4;

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
            // Define scales
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
            // Define x-axis
            const xAxis = d3.axisBottom()
                .scale(xScale);

            // Get results from all sites to define domain for y-axis
            let allResults = [];
            for (let i = 0; i < siteKeys.length; i++) {
                const results = data.sites[siteKeys[i]].map(d => d.Result);
                allResults = [...allResults, ...results];
            }
            const yMax = d3.max(allResults);
            const yScale = d3.scaleLinear()
                .domain([0, yMax])
                .range([height - margin.bottom, margin.top]);
            // Define y-axis
            const yAxis = d3.axisLeft()
                .scale(yScale);

            // Draw x-axis
            chart.append('g')
                .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                .call(xAxis);
    
            // Draw y-axis
            chart.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + margin.left + ', 0)')
                .call(yAxis);

            // Loops through each site and draw points
            for (let i = 0; i < siteKeys.length; i++) {
                const points = chart.append('g')
                    .attr('clip-path', 'url(#clip)');
                points.selectAll('.circle')
                    .data(data.sites[siteKeys[i]])
                    .enter().append('circle')
                    .attr('class', 'circle')
                    .attr('r', 4)
                    .attr('cx', (d) => { 
                        return xScale(d.SampleDate); 
                    })
                    .attr('cy', (d) => { 
                        return yScale(d.Result); 
                    })
                    .attr('fill', (d) => { return colorPaletteViz[i]; })
                    .attr('stroke', '#fff')
                    .on('mouseover', function(currentEvent, d) {
                        const formatDate = d3.timeFormat('%b %e, %Y');
                        let content = '<span style="color: #a6a6a6">' + formatDate(d.SampleDate) + '</span><br>' + d.Analyte + ": " + d.Result + ' ' + d.Unit;
                        if (d.Censored === true) {
                            content += '<br><i>Censored</i>';
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
                    .attr('cx', (d) => { return xScale(d.SampleDate); })
                    .attr('cy', (d) => { return yScale(d.Result); });
                points.exit()
                    .remove();
            }

            // *** Legend
            // Combine site codes and names
            let legendLabels = [];
            for (let i = 0; i < siteKeys.length; i++) {
                const combinedName = `${siteKeys[i]} (${siteDictRef.current[siteKeys[i]].name})`;
                legendLabels.push(combinedName);
            }
            console.log(siteDictRef.current);
            console.log(legendLabels);
            // Add legend
            const svgLegend = d3.select('#index-legend-container').append('svg')
                .attr('width', width)
                .attr('height', 29 * selectedSites.length);
            svgLegend.append('g')
                .attr('class', 'legendOrdinal')
                .attr('transform', 'translate(40, 20)');
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
        };

        if (modalVisible && !loading) {
            drawChart(data);
        }
    }, [modalVisible, loading])

    const getData = (station, analyte) => {
        return new Promise((resolve, reject) => {
            let url;
            if (habitatAnalytes.includes(analyte)) {
                // Get habitat data
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=9ce012e2-5fd3-4372-a4dd-63294b0ce0f6&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + analyte + '%22}&sort=%22SampleDate%22%20desc';
                url += '&fields=StationCode,StationName,Analyte,SampleDate,Result,Unit';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.ResultOriginal = parseFloat(d.Result).toFixed(2);
                        d.Result = parseFloat(d.ResultOriginal).toFixed(2);
                        d.Censored = false;
                        if (analyte === 'CSCI') {
                            d.Unit = 'score';
                        }
                    });
                    // Add station name to station dictionary
                    siteDictRef.current[station] = {
                        name: records[0].StationName,
                    }
                    resolve(records);
                });
            } else {
                // Get chemistry data
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + analyte + '%22}&sort=%22SampleDate%22%20desc';
                url += '&fields=StationCode,StationName,Analyte,SampleDate,Result,Unit,MDL,ResultQualCode';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.ResultOriginal = d.Result;
                        d['MDL'] = parseFloat(d['MDL']);
                        const censored = getCensored(d);
                        d['Censored'] = censored[0];
                        d['Result'] = censored[1];
                        if (analyte === 'pH') {
                            d.Unit = '';
                        }
                    });
                    records.filter(d => d.Result != null);
                    // Add station name to station dictionary
                    siteDictRef.current[station] = {
                        name: records[0].StationName,
                    }
                    resolve(records);
                });
            }
        });
    }

    return (
        <React.Fragment>
            <div className={buttonContainer}>
                <Button compact 
                    size='tiny'
                    disabled={selectedSites.length < 1 || !(analyte)}
                    onClick={handleClick} 
                    onKeyPress={handleClick}
                >
                    <Icon name='chart bar' />
                    Graph selected sites {selectedSites.length > 0 ? `(${selectedSites.length})` : '(0)' }
                </Button>
                <HelpIcon>
                    <p>To use the graph function, select an indicator from the <strong>Filters</strong> section above and at least one site from the table below. A maximum of four sites can be graphed at one time.</p>
                </HelpIcon>
            </div>
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                >
                    <Header icon='chart bar' content={analyte} />
                    <Modal.Content>
                        { loading ? 'Loading...' : 
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div id="index-chart-container"></div>
                                <div id="index-legend-container" style={{ display: 'flex', justifyContent: 'center', margin: '5px 0 15px 0' }}></div>
                            </div>
                        }
                    </Modal.Content>
                </Modal> 
            : '' }
        </React.Fragment>
    )
}