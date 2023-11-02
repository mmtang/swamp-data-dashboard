import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';
import Select from 'react-select';
import { matrixColor } from '../../constants/constants-app';
import { 
    chemistryResourceId, 
    customSelectStyle, 
    habitatResourceId, 
    tissueResourceId, 
    toxicityResourceId 
} from '../../utils/utils';

// Import styles
import { labelContainer, labelMain, labelText, selectWrapper } from './analyte-menu.module.css';

export default function AnalyteMenu({ 
    panelAnalyte, 
    panelSpecies, 
    setPanelAnalyte, 
    setPanelSpecies, 
    station 
}) {
    // Ref for storing all Analyte-Species combinations, to be used for the cross-filtering
    const [allCombos, setAllCombos] = useState(null);
    const [analyteList, setAnalyteList] = useState(null);
    const [loadingAnalyte, setLoadingAnalyte] = useState(true);
    const [loadingSpecies, setLoadingSpecies] = useState(false);
    const [speciesDisabled, setSpeciesDisabled] = useState(false);
    const [speciesList, setSpeciesList] = useState(null);

    const defaultSpecies = { label: 'All species', source: null, value: null };

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

    const getData = (params, dataType) => {
        return new Promise((resolve, reject) => {
            const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            fetch(url + new URLSearchParams(params))
                .then((resp) => resp.json())
                .then((json) => json.result.records)
                .then((records) => {
                    let data = records;
                    data.forEach(d => {
                        // Add source field, makes it easier to get data from portal if the analyte is selected
                        d.Source = dataType;
                    });
                    resolve(data);
                });
        });
    }

    // Get all Analyte-Species combinations from toxicity and tissue dataset
    const getAllCombos = (station) => {
        if (station) {
            // --- Chemistry
            const chemistrySql = `SELECT DISTINCT ON ("Analyte", "MatrixDisplay") "StationCode", "Analyte" AS "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${chemistryResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
            const chemistryParams = {
                resource_id: chemistryResourceId,
                sql: chemistrySql
            };
            // --- Habitat
            const habitatSql = `SELECT DISTINCT ON ("Analyte", "MatrixDisplay") "StationCode", "Analyte" AS "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${habitatResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
            const habitatParams = {
                resource_id: habitatResourceId,
                sql: habitatSql
            };
            // --- Toxicity
            const toxSql = `SELECT DISTINCT ON ("Analyte", "MatrixDisplay", "OrganismName") "StationCode", "Analyte" AS "AnalyteDisplay", "OrganismName" AS "Species", "MatrixDisplay", "AnalyteGroup1" FROM "${toxicityResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
            const toxParams = {
                resource_id: toxicityResourceId,
                sql: toxSql
            };
            // --- Tissue
            const tissueSql = `SELECT DISTINCT ON ("Analyte", "MatrixDisplay", "CommonName") "StationCode", "Analyte" AS "AnalyteDisplay", "CommonName" AS "Species", "MatrixDisplay", "AnalyteGroup1" FROM "${tissueResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
            const tissueParams = {
                resource_id: tissueResourceId,
                sql: tissueSql
            }
            Promise.all([
                getData(chemistryParams, 'chemistry'),
                getData(habitatParams, 'habitat'),
                getData(toxParams, 'toxicity'),
                getData(tissueParams, 'tissue')
                // Add tissue here
            ]).then((res) => {
                // Concatenate the records into one array
                let allData = res[0].concat(res[1], res[2], res[3]);
                // Add ID field, this is to allow us to filter by analyte and matrix based off one field
                allData.forEach(d => {
                    d.id = d.AnalyteDisplay + '$' + d.MatrixDisplay;
                });
                setAllCombos(allData);
            });
        }
    };

    const handleAnalyteChange = (selection) => {
        // If there is a selection, the passed object is formatted as { label: 'Temperature', value: 'Temperature$samplewater', matrix: 'samplewater', source: 'chemistry'}
        if (selection) {
            setPanelAnalyte(selection);
        } else {
            setPanelAnalyte(null);
        }
    }

    const handleSpeciesChange = (selection) => {
        // If there is a selection,
        if (selection) {
            setPanelSpecies(selection);
        } else {
            setPanelSpecies(null);
        }
    }

    const updateSpeciesList = () => {
        setLoadingSpecies(true);
        let options = allCombos;
        if (panelAnalyte) {
            options = options.filter(d => (d.AnalyteDisplay === panelAnalyte.label) && (d.MatrixDisplay === panelAnalyte.matrix));
        }
        // Filter out null values
        options = options.filter(d => d.Species != null);
        // Get unique objects from an array of objects based on object attribute value
        // https://yagisanatode.com/2021/07/03/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/
        const uniqueSpecies = [...new Map(options.map((item) => [item['Species'], item])).values(),];
        // Sort alphabetical by species name
        uniqueSpecies.sort((a, b) => a['Species'].localeCompare(b['Species']));
        const speciesOptions = uniqueSpecies.map(d => {
            return { 
                label: d.Species, 
                value: d.Species, 
                source: d.Source
            }
        });
        // Add 'All species' option to the top
        const defaultOption = [{ label: 'All species', value: null, source: null }];
        const allSpeciesOptions = defaultOption.concat(speciesOptions);
        setSpeciesList(allSpeciesOptions);
        setLoadingSpecies(false);       
    };

    const updateAnalyteList = () => {
        setLoadingAnalyte(true);
        const options = allCombos;
        // Get unique objects from an array of objects based on object attribute value
        // https://yagisanatode.com/2021/07/03/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/
        const uniqueOptions = [...new Map(options.map((item) => [item['id'], item])).values(),];
        // Sort alphabetical by id (analyte name + matrix name)
        uniqueOptions.sort((a, b) => a['id'].localeCompare(b['id']));
        const analyteOptions = uniqueOptions.map(d => {
            return { 
                label: d.AnalyteDisplay, 
                value: d.id,
                matrix: d.MatrixDisplay, 
                category: d.AnalyteGroup1,
                source: d.Source
            }
        });
        setAnalyteList(analyteOptions);
        setLoadingAnalyte(false);
    };

    useEffect(() => {
        if (station && !allCombos) {
            getAllCombos(station);
        }
        if (station && allCombos) {
            updateAnalyteList();
            updateSpeciesList();
        }
    }, [station]);

    useEffect(() => {
        if (allCombos) {
            updateAnalyteList();
            updateSpeciesList();
        }
    }, [allCombos]);

    useEffect(() => {
        if (allCombos) {
            if (panelAnalyte) {
                setPanelSpecies(null);
                // Analyte has been selected/changed
                if (panelAnalyte.source === 'toxicity' || panelAnalyte.source === 'tissue') {
                    setSpeciesDisabled(false);
                    updateSpeciesList();
                } else {
                    setSpeciesDisabled(true);
                }
            } else {
                // Analyte has been cleared
                updateSpeciesList();
                setSpeciesDisabled(false);
            }
        }
    }, [panelAnalyte]);

    /*
    useEffect(() => {
        if (allCombosRef.current) {
            console.log('hi');
        }
    }, [panelSpecies]);
    */

    return (
        <div>
            <div className={selectWrapper}>
                { !loadingAnalyte ? 
                    <Select
                        options={analyteList} 
                        isClearable={true}
                        isLoading={loadingAnalyte}
                        isSearchable={true}
                        placeholder='Analyte'
                        onChange={handleAnalyteChange}
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        formatOptionLabel={formatOptionLabel}
                        value={ panelAnalyte ? panelAnalyte : null }
                    />
                : <LoaderMenu /> }
            </div>
            <div className={selectWrapper}>
                { panelAnalyte && (panelAnalyte.source === 'tissue' || panelAnalyte.source === 'toxicity') ? 
                    <Select
                        options={speciesList} 
                        isClearable={false}
                        isDisabled={speciesDisabled}
                        isLoading={loadingSpecies}
                        isSearchable={true}
                        placeholder='Species'
                        onChange={handleSpeciesChange}
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        value={panelSpecies ? panelSpecies : defaultSpecies}
                    />
                : null }
            </div>
        </div>
    )
}