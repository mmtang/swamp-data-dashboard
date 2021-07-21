import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
//import CustomTooltip from './custom-tooltip';
import { timeParse, timeFormat } from 'd3';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { colorPaletteViz } from '../../utils/utils';


export default function ChartStation({ station, selectedAnalytes }) {
    const [data, setData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

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
            let vizParameters;
            if (selectedAnalytes.length > 4) {
                vizParameters = selectedAnalytes.slice(0, 4);
            } else {
                vizParameters = selectedAnalytes;
            }
            const promises = [];
            for (let i = 0; i < vizParameters.length; i++) {
                promises.push(getData(vizParameters[i], station));
            }
            Promise.all(promises)
                .then((results) => {
                    const obj = {
                        station: station,
                        analytes: {}
                    };
                    for (let i = 0; i < results.length; i++) {
                        const analyte = results[i][0].Analyte;
                        const data = results[i].map(d => { 
                            return { x: d.timestamp, y: d.Result };
                        });
                        obj.analytes[analyte] = data;
                    }
                    console.log(obj);
                });
        }
    }, [modalVisible]);

    const getData = (parameter) => {
        return new Promise((resolve, reject) => {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&limit=500&filters={%22StationCode%22:%22' + station + '%22%2C%22Analyte%22:%22' + parameter + '%22}&sort=%22SampleDate%22%20desc';
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

    return (
        <div style={{ marginTop: '1em'}}>
            <Button compact 
                size='tiny'
                disabled={selectedAnalytes.length < 1}
                onClick={handleClick} 
                onKeyPress={handleClick}
            >
                <Icon name='chart bar' />
                Graph selected parameters {selectedAnalytes.length > 0 ? `(${selectedAnalytes.length})` : '(0)' }
            </Button>
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                >
                    <Header icon='chart bar' content={`Selected parameters for ${station}`} />
                    <Modal.Content>
                        { loading ? 'Loading...' : 'Loaded' }
                    </Modal.Content>
                </Modal> 
            : '' }
        </div>
    )
}