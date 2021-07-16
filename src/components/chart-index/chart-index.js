import React, { useState, useEffect, useRef } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import CustomTooltip from './custom-tooltip';
import { timeParse, timeFormat } from 'd3';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { colorPaletteViz} from '../../utils/utils';


export default function ChartIndex({ selectedSites, analyte }) {
    const [data, setData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const unitRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y-%m-%d');

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
            // Limit number of sites graphed to 8
            let vizSites;
            if (selectedSites.length > 8) {
                vizSites = selectedSites.slice(0, 8);
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
                        const data = results[i].map(d => { 
                            return { x: d.timestamp, y: d.Result };
                        });
                        obj.sites[station] = data;
                    }
                    setData(obj);
                    unitRef.current = results[0][0].Unit;
                    setLoading(false);
                });
        }
    }, [modalVisible]);

    const getData = (station, analyte) => {
        return new Promise((resolve, reject) => {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + analyte + '%22}&sort=%22SampleDate%22%20desc';
            url += '&fields=StationCode,Analyte,SampleDate,Result,Unit';
            fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.Result = +d.Result;
                        d.timestamp = d.SampleDate.getTime();
                    });
                    resolve(records);
                });
        });
    }

    const chart = () => {
        return (
            <div style={{ width: '99%', height: '400px' }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <ScatterChart
                        width={500}
                        height={400}
                        margin={{
                            top: 30,
                            right: 40,
                            bottom: 30,
                            left: 40
                        }}
                    >
                        <CartesianGrid />
                        <XAxis 
                            type='number' 
                            dataKey='x' 
                            name='Sample Date' 
                            tickFormatter={unixTime => formatDate(new Date(unixTime))} 
                            domain={['dataMin', 'dataMax']} 
                        />
                        <YAxis 
                            type='number' 
                            name='Result' 
                            dataKey='y'
                            //unit={unitRef.current}
                            domain={['dataMin', 'dataMax']} 
                            tickFormatter={val => val.toLocaleString()}
                        />
                        { Object.keys(data.sites)
                            .map((d, i) => {
                                return (
                                    <Scatter
                                        key={d + '-scatter'}
                                        name={d}
                                        data={data.sites[d]} 
                                        fill={colorPaletteViz[i]}
                                        shape='circle'
                                        isAnimationActive={false}
                                        animationDuration={0}
                                    />
                                )
                            })
                        }
                        <Tooltip 
                            isAnimationActive={false}
                            animationDuration={0}
                            content={<CustomTooltip unit={unitRef.current} />}
                        />
                        <Legend />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        )
    }

    return (
        <div style={{ marginTop: '1em'}}>
            <Button compact 
                size='tiny'
                disabled={selectedSites.length < 1 || !(analyte)}
                onClick={handleClick} 
                onKeyPress={handleClick}
            >
                <Icon name='chart bar' />
                Graph selected sites
            </Button>
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                >
                    <Header icon='chart bar' content={analyte + ': Selected sites'} />
                    <Modal.Content>
                        { loading ? 'Loading...' : chart() }
                    </Modal.Content>
                </Modal> 
            : '' }
        </div>
    )
}