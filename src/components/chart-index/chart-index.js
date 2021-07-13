import React, { PureComponent, useState, useEffect, useRef } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { timeParse, timeFormat } from 'd3';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';


export default function ChartIndex({ selectedSites, analyte }) {
    const [data, setData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const unitRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y-%m-%d');

    const colors = ['#269ffb', '#febb3b', '#26e7a5'];


    const handleClick = () => {
        if (modalVisible === false) {
            setModalVisible(true);
        }
    }

    // Because onOpen is not working for as expected, use useEffect to initiate getting the data
    useEffect(() => {
        if (modalVisible) {
            console.log(selectedSites);
            if (data) { setData({}) };
            const promises = [];
            for (let i = 0; i < selectedSites.length; i++) {
                promises.push(getData(selectedSites[i], analyte));
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
        console.log(data.sites['519LSAC53']);
        return (
            <div style={{ width: '99%', height: '400px' }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <ScatterChart
                        width={500}
                        height={400}
                        margin={{
                            top: 30,
                            right: 60,
                            bottom: 30,
                            left: 60
                        }}
                    >
                        <CartesianGrid />
                        <XAxis 
                            type='number' 
                            dataKey='x' 
                            name='sampleDate' 
                            tickFormatter={unixTime => formatDate(new Date(unixTime))} 
                            domain={['auto', 'auto']} 
                        />
                        <YAxis 
                            type='number' 
                            dataKey='y' 
                            name='result' 
                            unit={unitRef.current}
                            domain={['0', 'auto']}
                        />
                        { Object.keys(data.sites)
                            .map((d, i) => {
                                return (
                                    <Scatter
                                        key={d + '-scatter'}
                                        name={d}
                                        data={data.sites[d]}
                                        fill={colors[i]}
                                        line
                                        shape='circle'
                                    />
                                )
                            })
                        }
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
                disabled={selectedSites.length < 2 || !(analyte)}
                onClick={handleClick} 
                onKeyPress={handleClick}
            >
                <Icon name='chart line' />
                Graph selected sites
            </Button>
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                >
                    <Header icon='chart line' content='Graph selected sites' />
                    <Modal.Content>
                        { loading ? 'Loading...' : chart() }
                    </Modal.Content>
                </Modal> 
            : '' }
        </div>
    )
}