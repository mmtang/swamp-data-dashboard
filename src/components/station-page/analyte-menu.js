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
import { selectWrapper } from './analyte-menu.module.css';

export default function AnalyteMenu({ 
    panelAnalyte, 
    panelSpecies, 
    setActiveMenuItem,
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
        if (label === 'All species') {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', overflowWrap: 'break-word' }}>{label}</div>
                </div>
            )
        } else 
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '80px', minWidth: '80px', marginRight: '10px', padding: '0 6px', borderRadius: '0', fontSize: '12px', backgroundColor: `${boxColor}`, color: '#fff' }}>
                        {matrix}
                    </div>
                    <div style={{ fontSize: '14px', overflowWrap: 'break-word' }}>{label}</div>
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
        return new Promise((resolve, reject) => {
            if (station) {
                // --- Chemistry
                const chemistrySql = `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${chemistryResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
                const chemistryParams = {
                    resource_id: chemistryResourceId,
                    sql: chemistrySql
                };
                // --- Habitat
                const habitatSql = `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1" FROM "${habitatResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`
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
                const tissueSql = `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay", "CommonName") "StationCode", "AnalyteDisplay", "CommonName" AS "Species", "MatrixDisplay", "AnalyteGroup1" FROM "${tissueResourceId}" WHERE "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
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
                        d.idSpecies = d.Species + '$' + d.MatrixDisplay;
                    });
                    resolve(allData);
                });
            } else {
                resolve(null);
            }
        })  
    };

    const handleAnalyteChange = (selection) => {
        // Reset the panel menu to graph to ensure that the graph draws whenever the user changes the analyte or species
        setActiveMenuItem('graph');
        // If there is a selection, the passed object is formatted as { label: 'Temperature', value: 'Temperature$samplewater', matrix: 'samplewater', source: 'chemistry'}
        if (selection) {
            setPanelAnalyte(selection);
        } else {
            setPanelAnalyte(null);
        }
    }

    const handleSpeciesChange = (selection) => {
        // Reset the panel menu to graph to ensure that the graph draws whenever the user changes the analyte or species
        setActiveMenuItem('graph');
        if (selection) {
            if (selection.label === 'All species') {
                // Reset to null as oppposed to the object { label: 'All species', value: null } to ensure that a cleared panelSpecies value will match the empty species value inherited from the main index page (variable: species), this is to ensure that comparison sites will show up when no option is selected for both species and panelSpecies
                setPanelSpecies(null); 
            } else {
                setPanelSpecies(selection);
            }
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
        const uniqueSpecies = [...new Map(options.map((item) => [item['idSpecies'], item])).values(),];
        // Sort alphabetical by species name
        uniqueSpecies.sort((a, b) => a['Species'].localeCompare(b['Species']));
        const speciesOptions = uniqueSpecies.map(d => {
            return { 
                label: d.Species, 
                matrix: d.MatrixDisplay,
                source: d.Source,
                value: d.idSpecies
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
        setTimeout(() => {
            let filteredOptions = allCombos;
            // Filter by species if species is selected
            if (panelSpecies && panelSpecies.value) {
                filteredOptions = filteredOptions.filter(d => d.idSpecies === panelSpecies.value);
            }
            // Get unique objects from an array of objects based on object attribute value
            // https://yagisanatode.com/2021/07/03/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/
            const uniqueOptions = [...new Map(filteredOptions.map((item) => [item['id'], item])).values(),];
            // Sort alphabetical by id (analyte name + matrix name)
            uniqueOptions.sort((a, b) => a['id'].localeCompare(b['id']));
            const analyteOptions = uniqueOptions.map(d => {
                return { 
                    category: d.AnalyteGroup1,
                    label: d.AnalyteDisplay,
                    matrix: d.MatrixDisplay, 
                    source: d.Source,
                    value: d.id
                }
            });
            setAnalyteList(analyteOptions);
            setLoadingAnalyte(false);
        }, 200);
    };

    const refreshSpeciesDisabled = () => {
        if (allCombos && panelAnalyte) {
            if (panelAnalyte.source === 'toxicity' || panelAnalyte.source === 'tissue') {
                setSpeciesDisabled(false);
                updateSpeciesList();
            } else {
                setSpeciesDisabled(true);
            }
        } else {
            setSpeciesDisabled(false);
        }
    }

    useEffect(() => {
        if (station && !allCombos) {
            getAllCombos(station)
            .then((res) => {
                setAllCombos(res);                
            })
        } else if (station && allCombos) {
            updateAnalyteList();
            updateSpeciesList();
            refreshSpeciesDisabled();
        }
    }, [station]);

    useEffect(() => {
        if (allCombos) {
            updateAnalyteList();
            updateSpeciesList();
            refreshSpeciesDisabled();
        }
    }, [allCombos]);

    useEffect(() => {
        if (allCombos) {
            if (panelAnalyte) {
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

    useEffect(() => {
        if (allCombos) {
            updateAnalyteList();
        }
    }, [panelSpecies]);

    return (
        <div>
            <div className={selectWrapper}>
                { !loadingAnalyte ? 
                    <Select
                        formatOptionLabel={formatOptionLabel}
                        isClearable={true}
                        isLoading={loadingAnalyte}
                        isSearchable={true}
                        maxMenuHeight={200}
                        onChange={handleAnalyteChange}
                        options={analyteList} 
                        placeholder='Analyte'
                        styles={customSelectStyle}
                        value={ panelAnalyte ? panelAnalyte : null }
                    />
                : <LoaderMenu /> }
            </div>
            <div className={selectWrapper}>
                <Select
                    formatOptionLabel={formatOptionLabel}
                    isClearable={true}
                    isDisabled={speciesDisabled}
                    isLoading={loadingSpecies}
                    isSearchable={true}
                    maxMenuHeight={200}
                    onChange={handleSpeciesChange}
                    options={speciesList} 
                    placeholder='Species'
                    styles={customSelectStyle}
                    value={panelSpecies ? panelSpecies : defaultSpecies}
                />
            </div>
        </div>
    )
}