import React, { useEffect, useState } from 'react';
import LoaderMenu from '../map-controls/loader-menu';
import Select from 'react-select';

import { matrixColor } from '../../constants/constants-app';
import { chemistryResourceId, customSelectStyle, habitatResourceId, toxicityResourceId } from '../../utils/utils';

export default function StationAnalyteMenu({ panelAnalyte, setPanelAnalyte, station }) {
    const [analyteList, setAnalyteList] = useState(null);
    const [loading, setLoading] = useState(true);

    const wrapperStyle = {
        marginTop: '2px'
    }

    const getData = (params, dataType) => {
        return new Promise((resolve, reject) => {
            const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            fetch(url + new URLSearchParams(params))
                .then((resp) => resp.json())
                .then((json) => json.result.records)
                .then((records) => {
                    // Process the returned data based on the data source/type
                    let data = records;
                    data.forEach(d => {
                        d.Source = dataType;
                    });
                    resolve(data);
                });
        });
    }

    useEffect(() => {
        if (station) {
            setLoading(true);
            const paramsChem = {
                resource_id: chemistryResourceId,
                sql: `SELECT DISTINCT ON ("Analyte") "StationCode", "Analyte", "MatrixDisplay", "AnalyteGroup1" FROM "${chemistryResourceId}" WHERE "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
            };
            const paramsHabitat = {
                resource_id: habitatResourceId,
                sql: `SELECT DISTINCT ON ("Analyte") "StationCode", "Analyte", "MatrixDisplay", "AnalyteGroup1" FROM "${habitatResourceId}" WHERE "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
            };
            const paramsTox = {
                resource_id: toxicityResourceId,
                sql: `SELECT DISTINCT ON ("Analyte") "StationCode", "Analyte", "MatrixDisplay", "AnalyteGroup1" FROM "${toxicityResourceId}" WHERE "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
            };
            Promise.all([
                // Chemistry dataset
                getData(paramsChem, 'chemistry'),
                // Habitat dataset
                getData(paramsHabitat, 'habitat'),
                // Tox dataset
                getData(paramsTox, 'toxicity')
            ]).then((res) => {
                // Concatenate the records into one array
                let allData = res[0].concat(res[1], res[2]);
                // Sort desc by last sample date
                allData.sort((a, b) => a['Analyte'].localeCompare(b['Analyte']));
                const analyteOptions = allData.map(d => {
                    return { 
                        label: d.Analyte, 
                        value: d.Analyte + '$' + d.MatrixDisplay, 
                        matrix: d.MatrixDisplay, 
                        category: d.AnalyteGroup1,
                        source: d.Source
                    }
                })
                setAnalyteList(analyteOptions);
                setLoading(false);
            });
        }
    }, [station]);

    const formatOptionLabel = ({ value, label, matrix }) => {
        const boxColor = matrixColor[matrix] ? matrixColor[matrix] : matrixColor['other'];
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px', marginRight: '10px', padding: '0 6px', borderRadius: '0', fontSize: '12px', backgroundColor: `${boxColor}`, color: '#fff' }}>
                    {matrix}
                </div>
                <div style={{ fontSize: '14px', overflowWrap: 'break-word' }}>{label}</div>
            </div>
        )
    };

    const handleAnalyteChange = (selection) => {
        // If there is a selection, the passed object is formatted as { label: 'Temperature', value: 'Temperature$samplewater', matrix: 'samplewater', source: 'chemistry'}
        if (selection) {
            setPanelAnalyte(selection);
        } else {
            setPanelAnalyte(null);
        }
    }

    return (
        <div style={wrapperStyle}>
            { !loading ? 
                <Select
                    options={analyteList} 
                    isClearable={true}
                    isLoading={loading}
                    isSearchable={true}
                    placeholder='Parameter'
                    onChange={handleAnalyteChange}
                    styles={customSelectStyle}
                    maxMenuHeight={200}
                    formatOptionLabel={formatOptionLabel}
                    value={panelAnalyte ? panelAnalyte : null}
                />
            : <LoaderMenu /> }
        </div>
    )
}