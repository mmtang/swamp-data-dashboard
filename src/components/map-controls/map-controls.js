import React, { useEffect, useState } from 'react';
import SelectSearch from 'react-select-search';
import { boxContainer, selectWrapper } from './map-controls.module.css';

export default function MapControls({ setAnalyte }) {
    const [analyteList, setAnalyteList] = useState(null);
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

    const handleChange = (value) => {
        setAnalyte(value);
    }

    if (analyteList) {
        return (
            <div className={boxContainer}>
                Or select a <span className="emphasis">water quality parameter</span>
                <div className={selectWrapper}>
                    <SelectSearch
                        options={analyteList} 
                        placeholder="Example: Nitrogen, Total"
                        onChange={handleChange}
                    />
                </div>
            </div>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}