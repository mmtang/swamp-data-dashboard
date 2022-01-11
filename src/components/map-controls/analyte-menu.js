import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { customSelectStyle, regionNumDict } from '../../utils/utils';

export default function AnalyteMenu({ analyte, setAnalyte, region, program }) {
    const allAnalytes = useRef(null);
    const [analyteList, setAnalyteList] = useState(null);
    const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?sql=SELECT%20DISTINCT%20%22Analyte%22%20from%20%22555ee3bf-891f-4ac4-a1fc-c8855cf70e7e%22%20ORDER%20BY%20%22Analyte%22%20ASC';

    const getAllAnalytes = () => {
        fetch(url)
        .then(response => response.json())
        .then(json => json.result.records)
        .then(records => {
            const analytes = records.sort((a, b) => a.Analyte.toLowerCase().localeCompare(b.Analyte.toLowerCase()));
            const data = analytes.map(d => ({ label: d.Analyte, value: d.Analyte }));
            allAnalytes.current = data;
            setAnalyteList(data);
        })
    }
    
    useEffect(() => {
        getAllAnalytes();
    }, []);

    const handleSelectChange = (selection) => {
        // If there is a selection, the passed object is formatted as { label: 'fhab', value: 'fhab'}
        if (selection) {
            const value = selection.value;
            // Check that the current state and selected value are different before setting the new analyte
            if (value !== analyte) {
                setAnalyte(value);
            }
        } else {
            // If selection is null, then check that the current state isn't already null before changing state to null
            if (analyte !== null) {
                setAnalyte(null)
            }
        }
    }

    useEffect(() => {
        if (!region && !program) {
            // Reset the analyte selector menu and populate with all analytes
            setAnalyteList(allAnalytes.current);
        } else {
            // Construct a new URL that will query the open data portal with a filter based on user selection
            // This enables crossfiltering of the analytes for when a program or region is selected
            let newUrl = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=100&fields=Analyte,Region,Bioaccumulation,Bioassessment,Fhab,Spot&filters={';
            // This array will hold the url strings for filtering program and region
            const urlStrings = [];
            // Create the url strings
            if (program) {
                // Capitalize the first letter of the program name to match the open data portal column name
                // bioassessment --> Bioassessment, fhab --> Fhab
                const capitalizedProgram = program[0].toUpperCase() + program.substring(1);
                urlStrings.push(`%22${capitalizedProgram}%22:%22True%22`);
            }   
            if (region) {
                // Convert region name to region number to match open data portal values
                // Los Angeles --> 4
                const regionNumber = regionNumDict[region];
                urlStrings.push(`%22Region%22:${regionNumber}`);
            }
            // Join the url strings (if needed) and then append to the url
            if (urlStrings.length > 1) {
                // If there are two, join them with a comma 
                newUrl += urlStrings.join('%2C')
            } else {
                // If there is only one, then take the first
                newUrl += urlStrings[0];
            }
            newUrl += '}';

            // Get the data with the new url
            fetch(newUrl)
            .then(response => response.json())
            .then(json => json.result.records)
            .then(records => {
                if (records.length > 0) {
                    const analytes = records.map(d => d.Analyte);
                    const uniqueAnalytes = [...new Set(analytes)].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                    const data = uniqueAnalytes.map(d => ({ label: d, value: d }));
                    setAnalyteList(data);
                } else {
                    setAnalyteList([]);
                }
            })
        }
        
    }, [region, program])

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
                    placeholder='Indicator'
                    onChange={handleSelectChange}
                    styles={customSelectStyle}
                    maxMenuHeight={200}
                />
            </React.Fragment>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}