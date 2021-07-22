import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { customSelectStyle } from '../../utils/utils';
//import AnalyteCard from './analyte-card';

export default function AnalyteMenu({ selectedAnalyte, setAnalyte }) {
    const [analyteList, setAnalyteList] = useState(null);
    const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?sql=SELECT%20DISTINCT%20%22Analyte%22%20from%20%22555ee3bf-891f-4ac4-a1fc-c8855cf70e7e%22%20ORDER%20BY%20%22Analyte%22%20ASC';
    
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(json => json.result.records)
            .then(records => {
                const data = records.map(d => ({ label: d.Analyte, value: d.Analyte }));
                setAnalyteList(data);
            })
    }, []);

    const handleSelectChange = (selection) => {
        if (selection) {
            const value = selection.value;
            if (value !== selectedAnalyte) {
                setAnalyte(value);
            }
        } else {
            if (selection !== selectedAnalyte) {
                setAnalyte(selection)
            }
        }
    }

    /*
    const handleRadioChange = (e) => {
        setTrendType(e.currentTarget.value);
    }
    */

    if (analyteList) {
        return (
            <React.Fragment>
                <Select
                    options={analyteList} 
                    isClearable={true}
                    isSearchable={true}
                    placeholder='Parameter'
                    onChange={handleSelectChange}
                    styles={customSelectStyle}
                    maxMenuHeight={200}
                />
                {/*
                { selectedAnalyte ? <AnalyteCard selectedAnalyte={selectedAnalyte} /> : null }
                */}
            </React.Fragment>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}