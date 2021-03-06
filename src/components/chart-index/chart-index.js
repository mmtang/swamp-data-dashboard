import React, { useState, useEffect, useRef } from 'react';
import AnalyteCard from '../map-controls/analyte-card';
import DownloadData from '../common/download-data';
import LoaderBlock from '../common/loader-block';
import MessageDismissible from '../common/message-dismissible';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { analytes, analyteScoringCategories, habitatAnalytes, analyteYMax, chemDataFields, habitatDataFields, dataQualityCategories  } from '../../constants/constants-data';
import { colorPaletteViz } from '../../constants/constants-app';
import { buttonContainer, customTooltip, chartFooter, legendContainer, cardWrapper, modalContent, downloadWrapper } from './chart-index.module.css';

// Component for rendering graph on the dashboard index page (from map and dashboard)
export default function ChartIndex({ text, selectedSites, analyte }) {
    const [data, setData] = useState({});
    const [downloadData, setDownloadData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [overSelectionLimit, setOverSelectionLimit] = useState(false);

    const limitRef = useRef(5); // Limit number of sites that can be graphed
    const unitRef = useRef(null);
    const siteDictRef = useRef({});

    const randomId = useRef(Math.floor((Math.random() * 100000).toString()));
    const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = d3.timeFormat('%b %e, %Y');
    const formatNumber = d3.format(',');

    const overLimitMessage = `A maximum of ${limitRef.current.toLocaleString()} stations can be graphed at one time. ${limitRef.current.toLocaleString()} of the ${selectedSites.length} stations you selected are graphed below.`;

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
            let vizSites;
            if (selectedSites.length > limitRef.current) {
                vizSites = selectedSites.slice(0, limitRef.current);
                setOverSelectionLimit(true);
            } else {
                vizSites = selectedSites;
                setOverSelectionLimit(false);
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
                    const unitArray = [];
                    for (let i = 0; i < results.length; i++) {
                        const station = results[i][0].StationCode;
                        const data = results[i];
                        const units = results[i].map(d => d.Unit);
                        unitArray.push(...units);
                        obj.sites[station] = data;
                    }
                    // Get unique units for display in modal header
                    // Can have multiple (equivalent) units in one dataset
                    const unitSet = new Set(unitArray);
                    // Back to an array
                    const uniqueUnits = Array.from(unitSet);
                    const unitString = uniqueUnits.join(', ');
                    unitRef.current = unitString;

                    setLoading(false);
                    setData(obj);
                    processDataForDownload(obj);
                });
        }
    }, [modalVisible]);

    // This function packages the chart data into a form that is ready for download.
    // It combines multiple sites' data into one array. No need to worry about different data structures because all sites under the same analyte should have the same structure.
    const processDataForDownload = (obj) => {
        if (obj.sites) {
            const siteDicts = obj.sites;
            let dictValues = [];
            Object.keys(siteDicts).forEach(key => {
                dictValues.push(siteDicts[key]);
            });
            const mergedData = [].concat(...dictValues);
            setDownloadData(mergedData);
        }
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
            const container = d3.select('#index-chart-container').node();
            const targetWidth = parseInt(container.getBoundingClientRect().width);

            const chartId = 'chart-' + randomId.current;
            const margin = { top: 20, right: 35, bottom: 30, left: 55 };
            //const width = 645 + margin.left + margin.right;
            //const height = 220 + margin.top + margin.bottom;
            const width = targetWidth;
            const height = 220 + margin.top + margin.bottom;
            const clipPadding = 5;

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
                .call(yAxis);

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
        
            // Loops through each site and draw points
            for (let i = 0; i < siteKeys.length; i++) {
                const points = chart.append('g')
                    .attr('clip-path', 'url(#clip)');
                points.selectAll('.circle')
                    .data(data.sites[siteKeys[i]])
                    .enter().append('circle')
                    .attr('class', 'circle')
                    .attr('r', 4)
                    .attr('cx', d => xScale(d.SampleDate))
                    .attr('cy', d => yScale(d.ResultDisplay))
                    .attr('fill', d => d.Censored ? '#e3e4e6' : colorPaletteViz[i])
                    .attr('stroke', d => d.Censored ? colorPaletteViz[i] : '#fff')
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
            }

            // *** Legend
            // Combine site codes and names
            let legendLabels = [];
            for (let i = 0; i < siteKeys.length; i++) {
                const combinedName = `${siteKeys[i]} (${siteDictRef.current[siteKeys[i]].name})`;
                const shortenedName = combinedName.length > 40 ? combinedName.slice(0, 40) + '...' : combinedName
                legendLabels.push(shortenedName);
            }
            // Add legend
            const svgLegend = d3.select('#index-legend-container').append('svg')
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
        };

        if (!loading && data) {
            drawChart(data);
        }
    }, [loading, data])

    const getData = (station, analyte) => {
        return new Promise((resolve, reject) => {
            let url;
            if (habitatAnalytes.includes(analyte)) {
                // Get habitat data
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=9ce012e2-5fd3-4372-a4dd-63294b0ce0f6&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + analyte + '%22}&sort=%22SampleDate%22%20desc';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    // Filter for records that meet data quality requirements
                    const data = records.filter(d => dataQualityCategories.includes(d['DataQuality']))
                    data.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.ResultDisplay = +parseFloat(d.Result).toFixed(3);
                        d.Censored = false;
                        if (analyte === 'CSCI') {
                            d.Unit = 'score';
                        }
                    });
                    // Add station name to station dictionary
                    siteDictRef.current[station] = {
                        name: data[0].StationName,
                    }
                    resolve(data);
                });
            } else {
                // Get chemistry data
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + analyte + '%22}&sort=%22SampleDate%22%20desc';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    // Filter for records that meet data quality requirements
                    const data = records.filter(d => dataQualityCategories.includes(d['DataQuality']))
                    data.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                        d.ResultDisplay = +d['ResultDisplay'].toFixed(3);
                        if (analyte === 'pH') {
                            d.Unit = '';
                        }
                    });
                    // Add station name to station dictionary
                    siteDictRef.current[station] = {
                        name: data[0].StationName,
                    }
                    resolve(data);
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
                    {text}
                </Button>
            </div>
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                    closeOnDimmerClick={true}
                >
                    <Header content={
                        analyte === 'pH' ? 'pH' :
                        unitRef.current ? `${analyte} (${unitRef.current})` :
                        analyte
                    } />
                    <Modal.Content>
                        { loading ? <LoaderBlock /> : 
                            <div className={modalContent}>
                                {/* Display message if user selects too many sites */}
                                { overSelectionLimit ? 
                                    <MessageDismissible color='red' message={overLimitMessage} /> 
                                : null }
                                <div className={downloadWrapper}>
                                    <DownloadData 
                                        data={downloadData}
                                        fields={ habitatAnalytes.includes(analyte) ? habitatDataFields : chemDataFields }
                                    >
                                        Download data
                                    </DownloadData>
                                </div>
                                <div id="index-chart-container"></div>
                                <div className={chartFooter}>
                                    <div id="index-legend-container" className={legendContainer}></div>
                                    <div className={cardWrapper}>
                                        <AnalyteCard analyte={analyte} />   
                                    </div>
                                </div>
                            </div>
                        }
                    </Modal.Content>
                </Modal> 
            : '' }
        </React.Fragment>
    )
}