import React, { useEffect, useRef, useState } from 'react';
import AnalyteMenu from '../map-controls/analyte-menu';
import ClearFilters from './clear-filters';
import HelpIcon from '../icons/help-icon';
import ProgramMenu from '../map-controls/program-menu';
import RegionMenu from '../map-controls/region-menu';

import { 
    capitalizeFirstLetter, 
    chemistryResourceId,
    habitatResourceId,
    programDict, 
    regionDict,
    tissueResourceId,
    toxicityResourceId
} from '../../utils/utils';

import { 
    analyteWrapper, 
    buttonContainer, 
    island,
    pLabel
} from './accordion-menu.module.css';

// This component generates the structure for the accordion menu on the index page
// It fetches data that is used by multiple child componenets
export default function AccordionMenu({ 
    analyte, 
    program, 
    region, 
    setAnalyte, 
    setProgram,
    setRegion,
    setSpecies,
    species
}) {  
    // State for select menus
    const allAnalyteCombosRef = useRef(null);
    const allAnalyteOptionsRef = useRef(null);
    const allCategoryOptionsRef = useRef(null);
    const [analyteList, setAnalyteList] = useState(null);
    const [category, setCategory] = useState(null);
    const [categoryList, setCategoryList] = useState(null);
    const [programList, setProgramList] = useState(null);
    const [regionList, setRegionList] = useState(null);
    const [speciesList, setSpeciesList] = useState(null);

    const getAllAnalyteOptions = () => {
        return new Promise((resolve, reject) => {
            const chemParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "AnalyteGroup1", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "${chemistryResourceId}" WHERE "DataQuality" NOT IN ('MetaData', 'Reject record')`
            }
            const habitatParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "AnalyteGroup1", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "${habitatResourceId}" WHERE "DataQuality" NOT IN ('MetaData', 'Reject record')`
            };
            const toxParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "OrganismName", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "OrganismName" AS "Species", "AnalyteGroup1", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "${toxicityResourceId}" WHERE "DataQuality" NOT IN ('MetaData', 'Reject record')`
            }
            const tissueParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "CommonName", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "CommonName" AS "Species", "AnalyteGroup1", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "${tissueResourceId}"`
            }
            Promise.all([   
                getData(chemParams, 'chemistry'),
                getData(habitatParams, 'habitat'),
                getData(toxParams, 'toxicity'),
                getData(tissueParams, 'tissue')
            ]).then((res) => {
                const allOptions = res[0].concat(res[1], res[2], res[3]);
                allOptions.forEach(d => {
                    d.Region = '' + parseInt(d.Region)
                });
                allOptions.sort((a, b) => a.Analyte.localeCompare(b.Analyte));
                resolve(allOptions);
            });
        });
    }

    const getData = (params, dataSource) => {
        return new Promise((resolve, reject) => {
            const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            fetch(url + new URLSearchParams(params))
            .then((resp) => resp.json())
            .then((json) => json.result.records)
            .then((records) => {
                records.forEach(d => {
                    d.Source = dataSource;
                });
                resolve(records);
            });
        })
    }

    const updateAnalyteList = (data) => {
        if (data) {
            // Pick a subset of columns rather than working with all columns = better performance and easier to work with
            const analyteRecords = data.map(d => {
                return { 
                    label: d.Analyte,
                    value: d.Analyte + '$' + d.MatrixDisplay, 
                    matrix: d.MatrixDisplay, 
                    category: d.AnalyteGroup1,
                    source: d.Source
                }
            })
            // Get unique objects from an array of objects based on object attribute value
            // https://yagisanatode.com/2021/07/03/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/
            const uniqueAnalytes = [...new Map(analyteRecords.map((item) => [item['value'], item])).values(),];
            // Sort alphabetical order by "value", which combines the analyte and matrix names
            uniqueAnalytes.sort((a, b) => a['value'].localeCompare(b['value']));
            setAnalyteList(uniqueAnalytes);
        } else {
            console.error('Empty or null data');
        }
    }

    const updateCategoryList = (data) => {
        if (data) {
            const categoryRecords = data.map(d => d.AnalyteGroup1);
            // Get list of unique categories, sorted asc
            let uniqueCategories = [...new Set(categoryRecords)];
            uniqueCategories.sort();
            // Filter out null values, don't want this value to show in the select menu
            uniqueCategories = uniqueCategories.filter(d => d !== null);
            // Build array of objects for the select menu
            const categoryOptions = uniqueCategories.map(d => {
                return {label: d, value: d};
            });
            setCategoryList(categoryOptions);
        }
    }

    const updateSpeciesList = (data) => {
        if (data) {
            // Get list of unique species based on the filtered data (data)
            const speciesRecords = data.map(d => {
                return {
                    label: d.Species,
                    value: d.Species,
                    source: d.Source
                }
            });
            // Build array of objects
            let uniqueSpecies = [...new Map(speciesRecords.map((item) => [item['value'], item])).values(),];
            // Filter out null values so they don't show in the select menu
            uniqueSpecies = uniqueSpecies.filter(d => d.label != null);
            // Sort alphabetical order
            uniqueSpecies.sort((a, b) => a['label'].localeCompare(b['label']));
            // Add 'All species' option to the top
            const defaultOption = [{ label: 'All species', value: null, source: null }];
            const allSpeciesOptions = defaultOption.concat(uniqueSpecies);
            setSpeciesList(allSpeciesOptions);
        }
    }

    const updateProgramList = (data) => {
        if (data) {
            let programOptions = [];
            // Work on a subset of the fields for better performance and simplicity
            const programRecords = data.map(d => {
                return {
                    bioassessment: d.Bioassessment,
                    bioaccumulation: d.Bioaccumulation,
                    fhab: d.Fhab,
                    spot: d.Spot
                }
            });
            if (programRecords.map(d => d.bioassessment).some(d => d === 'True')) {
                programOptions.push({ label: programDict['bioassessment'], value: 'bioassessment' });
            };
            if (programRecords.map(d => d.bioaccumulation).some(d => d === 'True')) {
                programOptions.push({ label: programDict['bioaccumulation'], value: 'bioaccumulation' });
            };
            if (programRecords.map(d => d.fhab).some(d => d === 'True')) {
                programOptions.push({ label: programDict['fhab'], value: 'fhab' });
            };
            if (programRecords.map(d => d.spot).some(d => d === 'True')) {
                programOptions.push({ label: programDict['spot'], value: 'spot' });
            }
            setProgramList(programOptions);
        }
    }

    const updateRegionList = (data) => {
        if (data) {
            const regionRecords = data.map(d => d.Region);
            let uniqueRegions = [...new Set(regionRecords)];
            // Filter out records with Region = '0' and Region = null. Don't want these values shown in the select menu
            uniqueRegions = uniqueRegions.filter(d => d !== '0' && d !== null);
            uniqueRegions.sort()
            // Format the values for the select element to consume
            const regionOptions = uniqueRegions.map(d => {
                return { label: regionDict[d], value: regionDict[d] }
            });
            setRegionList(regionOptions);
        } else {
            console.error('Empty or null data');
        }
    }

    // Initial load - get all analyte data
    useEffect(() => {
        getAllAnalyteOptions()
        .then((res) => {
            if (res) {
                // Save result in ref for filtering later if state changes
                // This stores ALL analyte/category/region/program combinations (with duplicates)
                allAnalyteCombosRef.current = res;
                // Update data for select elements
                updateRegionList(res);
                updateAnalyteList(res);
                updateCategoryList(res);
                updateProgramList(res);
                updateSpeciesList(res);
                // Save list of unique analytes, done on initial load only
                allAnalyteOptionsRef.current = analyteList;
                // Save list of unique analyte categories, done on initial load only
                allCategoryOptionsRef.current = categoryList;
            }
        });
    }, []);

    const updateMenuOptions = ({
        updateProgram,
        updateRegion,
        updateCategory,
        updateSpecies,
        updateAnalyte
    }) => {
        // Check that the data reference already exists; otherwise, this will run on intial load with the reference = null
        if (allAnalyteCombosRef.current) {
            // Interrelated filters - Update the select menu lists in isolation from each other. Start with the original dataset (all combinations) and filter using the same state variables (program, region, category, species, analyte) across all filter menus. Each block of code under the if statements will return the possible values that can be selected based on the current user selection. 
            if (updateProgram) {
                // Omit filtering by selected program  valuefor the block of code below because you want the program filter menu to refresh showing all possible values for program. Repeat this same pattern in the other if statements
                let newPrograms = allAnalyteCombosRef.current;
                if (region) { newPrograms = newPrograms.filter(d => d['Region'] === region) };
                if (category) { newPrograms = newPrograms.filter(d => d.AnalyteGroup1 === category) };
                if (species) { newPrograms = newPrograms.filter(d => d.Species === species.value) };
                if (analyte) {
                    newPrograms = newPrograms.filter(d => d.Analyte === analyte.label);
                    newPrograms = newPrograms.filter(d => d.MatrixDisplay === analyte.matrix);
                }
                updateProgramList(newPrograms);
            }
            if (updateRegion) {
                let newRegions = allAnalyteCombosRef.current;
                if (program) { newRegions = newRegions.filter(d => d[capitalizeFirstLetter(program)] === 'True') };
                if (category) { newRegions = newRegions.filter(d => d.AnalyteGroup1 === category) };
                if (species) { newRegions = newRegions.filter(d => d.Species === species.value) };
                if (analyte) {
                    newRegions = newRegions.filter(d => d.Analyte === analyte.label);
                    newRegions = newRegions.filter(d => d.MatrixDisplay === analyte.matrix);
                }
                updateRegionList(newRegions);
            }
            if (updateCategory) {
                let newCategories = allAnalyteCombosRef.current;
                if (program) { newCategories = newCategories.filter(d => d[capitalizeFirstLetter(program)] === 'True') };
                if (region) { newCategories = newCategories.filter(d => d['Region'] === region) };
                if (species) { newCategories = newCategories.filter(d => d.Species === species.value) };
                if (analyte) {
                    newCategories = newCategories.filter(d => d.Analyte === analyte.label);
                    newCategories = newCategories.filter(d => d.MatrixDisplay === analyte.matrix);
                }
                updateCategoryList(newCategories);
            }
            if (updateSpecies) {
                let newSpecies = allAnalyteCombosRef.current;
                if (program) { newSpecies = newSpecies.filter(d => d[capitalizeFirstLetter(program)] === 'True') };
                if (region) { newSpecies = newSpecies.filter(d => d['Region'] === region) };
                if (category) { newSpecies = newSpecies.filter(d => d.AnalyteGroup1 === category) };
                if (analyte) {
                    newSpecies = newSpecies.filter(d => d.Analyte === analyte.label);
                    newSpecies = newSpecies.filter(d => d.MatrixDisplay === analyte.matrix);
                }
                updateSpeciesList(newSpecies);
            }
            if (updateAnalyte) {
                let newAnalytes = allAnalyteCombosRef.current;
                if (program) { newAnalytes = newAnalytes.filter(d => d[capitalizeFirstLetter(program)] === 'True') };
                if (region) { newAnalytes = newAnalytes.filter(d => d['Region'] === region) };
                if (category) { newAnalytes = newAnalytes.filter(d => d.AnalyteGroup1 === category) };
                if (species) { newAnalytes = newAnalytes.filter(d => d.Species === species.value) };
                updateAnalyteList(newAnalytes);
            };
        }
    };

    useEffect(() => {
        updateMenuOptions({ updateProgram: false, updateRegion: true, updateCategory: true, updateSpecies: true, updateAnalyte: true });
    }, [program]);

    useEffect(() => {
        updateMenuOptions({ updateProgram: true, updateRegion: false, updateCategory: true, updateSpecies: true, updateAnalyte: true });
    }, [region]);

    useEffect(() => {
        // Must differentiate between whether a new category value was selected or if the previous category value was cleared
        if (category) {
            // If a new category was selected, do not update/refresh the category menu
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: false, updateSpecies: true, updateAnalyte: true });
        } else {
            // If the category filter was cleared, update/refresh the category menu or else it may continue to show stale values
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: true, updateSpecies: true, updateAnalyte: true });
        }
    }, [category]);

    useEffect(() => {
        updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: false, updateSpecies: false, updateAnalyte: true });
    }, [species]);

    useEffect(() => {
        // Refresh the species menu for all cases even when analyte is not selected. 'Always refresh but control when to show the menu' is the more straight forward approach (as opposed to only refreshing it under certain conditions; for example, when a tissue or toxicity analyte is selected)
        updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: false, updateSpecies: true, updateAnalyte: true }); 
    }, [analyte]);

    return (
        <div style={{ marginTop: '1.4em' }}>
            <div className={island}>
                <div className={analyteWrapper}>
                        {/* A high value is needed for flex-basis so that the select box doesn't collapse under flexbox. The actual value is seemingly not that important, only that it's a high value. It might be better to set the width of the select. */}
                        <div style={{ flexBasis: '100%'}}>
                            <AnalyteMenu 
                                analyte={analyte}
                                analyteList={analyteList} 
                                category={category}
                                categoryList={categoryList}
                                setAnalyte={setAnalyte} 
                                setCategory={setCategory}
                                setSpecies={setSpecies}
                                species={species}
                                speciesList={speciesList}
                            />
                        </div>
                    </div>
                </div>
            <div className={island}>
                <p className={pLabel}>
                    Statewide monitoring program
                </p>
                <ProgramMenu 
                    program={program} 
                    programList={programList} 
                    setAnalyte={setAnalyte}
                    setCategory={setCategory}
                    setProgram={setProgram} 
                />
                <p className={pLabel}>
                    Region
                    <HelpIcon wide='very'>
                        <p>SWAMP’s regional assessments are planned and executed by each of the nine Regional Water Quality Control Boards. Each region identifies its own monitoring priorities and designs assessments to answer specific monitoring questions.</p>
                        <img src=".\rb-map-small.jpg" alt='Statewide map of regional water board boundaries' style={{ display: 'block', margin: 'auto', maxWidth: '300px' }} />
                        <p><a href="https://www.waterboards.ca.gov/publications_forms/publications/factsheets/docs/boardoverview.pdf" target="_blank" rel="noreferrer noopener">Source</a></p>
                    </HelpIcon>
                </p>
                <RegionMenu 
                    region={region}
                    regionList={regionList}
                    setRegion={setRegion} 
                />
            </div>
            <div className={buttonContainer}>
                {/* Clear all filters */}
                <ClearFilters 
                    setAnalyte={setAnalyte}
                    setCategory={setCategory}
                    setProgram={setProgram}
                    setRegion={setRegion}
                    setSpecies={setSpecies}
                />
            </div>
        </div>
    )
}