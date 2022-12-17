import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';
import Select from 'react-select';
import { matrixColor } from '../../constants/constants-app';
import { 
    capitalizeFirstLetter, 
    chemistryResourceId, 
    customSelectStyle, 
    habitatResourceId, 
    toxicityResourceId 
} from '../../utils/utils';

// Import styles
import { labelContainer, labelMain, labelText, selectWrapper } from './analyte-menu.module.css';

export default function AnalyteMenu({ panelAnalyte, program, setPanelAnalyte, station }) {
    const [analyteList, setAnalyteList] = useState(null);
    const [loading, setLoading] = useState(true);

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

            // Chemistry
            let sqlChem = `SELECT DISTINCT ON ("AnalyteDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${chemistryResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
            if (program) {
                sqlChem += ` AND "${capitalizeFirstLetter(program)}" = 'True'`;
            };
            const paramsChem = {
                resource_id: chemistryResourceId,
                sql: sqlChem
            };

            // Habitat
            let sqlHabitat = `SELECT DISTINCT ON ("AnalyteDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${habitatResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
            if (program) {
                sqlHabitat += ` AND "${capitalizeFirstLetter(program)}" = 'True'`;
            };
            const paramsHabitat = {
                resource_id: habitatResourceId,
                sql: sqlHabitat
            };

            // Toxicity
            let sqlTox = `SELECT DISTINCT ON ("AnalyteDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${toxicityResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
            if (program) {
                sqlTox += ` AND "${capitalizeFirstLetter(program)}" = 'True'`;
            }
            const paramsTox = {
                resource_id: toxicityResourceId,
                sql: sqlTox
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
                allData.sort((a, b) => a['AnalyteDisplay'].localeCompare(b['AnalyteDisplay']));
                const analyteOptions = allData.map(d => {
                    return { 
                        label: d.AnalyteDisplay, 
                        value: d.AnalyteDisplay + '$' + d.MatrixDisplay, 
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
            <div className={labelContainer}>
                <div className={labelMain} style={{ backgroundColor: `${boxColor}` }}>
                    {matrix}
                </div>
                <div className={labelText}>{label}</div>
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
        <div className={selectWrapper}>
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