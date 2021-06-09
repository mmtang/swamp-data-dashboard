import React, { useEffect, useState } from 'react';
import SelectSearch from 'react-select-search';
import AnalyteCard from './analyte-card';
import { boxContainer, selectWrapper, radioWrapper } from './map-controls.module.css';

export default function AnalyteMenu({ selectedAnalyte, setAnalyte }) {
    const [analyteList, setAnalyteList] = useState(null);
    const [trendType, setTrendType] = useState('ten');
    const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?sql=SELECT%20DISTINCT%20%22Analyte%22%20from%20%22555ee3bf-891f-4ac4-a1fc-c8855cf70e7e%22%20ORDER%20BY%20%22Analyte%22%20ASC';
    
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(json => json.result.records)
            .then(records => {
                const data = records.map(d => ({ name: d.Analyte, value: d.Analyte }));
                setAnalyteList(data);
            })
    }, []);

    const handleSelectChange = (value) => {
        setAnalyte(value);
    }

    const handleRadioChange = (e) => {
        setTrendType(e.currentTarget.value);
    }

    if (analyteList) {
        return (
            <React.Fragment>
                <div className={boxContainer}>
                    Select a <span className="emphasis">water quality parameter</span>
                    <div className={selectWrapper}>
                        <SelectSearch
                            options={analyteList} 
                            placeholder="Example: Nitrogen, Total"
                            onChange={handleSelectChange}
                        />
                    </div>
                    { selectedAnalyte ? <AnalyteCard selectedAnalyte={selectedAnalyte} /> : null }
                    <div className={radioWrapper}>
                        <input type="radio" id="analyteTrend10" name="mapDisplay" value="ten" onChange={handleRadioChange} checked={trendType === 'ten'} /><label htmlFor="analyteTrend10">&nbsp;Trend (last 10 years)</label>
                        &nbsp;
                        <input type="radio" id="analyteTrend10" name="mapDisplay" value="all" onChange={handleRadioChange} checked={trendType === 'all' } /><label htmlFor="analyteTrend10">&nbsp;Trend (all readings)</label>
                    </div>
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}