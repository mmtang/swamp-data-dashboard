import React, { useEffect, useRef, useState } from 'react';
import AnalyteMenu from '../map-controls/analyte-menu';
import BulkDownload from './bulk-download';
import ClearFilters from './clear-filters';
import HelpIcon from '../icons/help-icon';
import ProgramMenu from '../map-controls/program-menu';
import RegionMenu from '../map-controls/region-menu';

import { Accordion, Icon } from 'semantic-ui-react';
import { capitalizeFirstLetter, programDict, regionDict } from '../../utils/utils';

import { analyteWrapper, buttonContainer, customAccordion, customTitle, leadingIcon, pLabel, titleWrapper} from './accordion-menu.module.css';

// This component generates the structure for the accordion menu on the explore_data index page
// It calls upon other componenets to fill the content for each panel
export default function AccordionMenu({ 
    analyte, 
    program, 
    region, 
    setAnalyte, 
    setProgram,
    setRegion
}) {  
    // Open all panels upon initial load; keep track of selection and save to state
    const [activeIndex, setActiveIndex] = useState([0, 1, 2]);

    // State for select menus
    const allAnalyteCombosRef = useRef(null);
    const allAnalyteOptionsRef = useRef(null);
    const allCategoryOptionsRef = useRef(null);
    const [analyteList, setAnalyteList] = useState(null);
    const [category, setCategory] = useState(null);
    const [categoryList, setCategoryList] = useState(null);
    const [programList, setProgramList] = useState(null);
    const [regionList, setRegionList] = useState(null);

    const getAllAnalyteOptions = () => {
        return new Promise((resolve, reject) => {
            const chemParams = {
                sql: `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "AnalyteDisplay", "AnalyteGroup1", "AnalyteGroup2", "AnalyteGroup3", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e" WHERE "DataQuality" NOT IN ('MetaData', 'Reject record')`
            }
            const habitatParams = {
                sql: `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "AnalyteDisplay", "AnalyteGroup1", "AnalyteGroup2", "AnalyteGroup3", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "6d9a828a-d539-457e-922c-3cb54a6d4f9b" WHERE "DataQuality" NOT IN ('MetaData', 'Reject record')`
            };
            const toxParams = {
                sql: `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "AnalyteDisplay", "AnalyteGroup1", "AnalyteGroup2", "AnalyteGroup3", "MatrixDisplay", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "a6dafb52-3671-46fa-8d42-13ddfa36fd49" WHERE "DataQuality" NOT IN ('MetaData', 'Reject record')`
            }
            Promise.all([
                getData(chemParams, 'chemistry'),
                getData(habitatParams, 'habitat'),
                getData(toxParams, 'toxicity')
            ]).then((res) => {
                const allOptions = res[0].concat(res[1], res[2]);
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
                    d.Analyte = d.AnalyteDisplay
                    d.Source = dataSource;
                });
                resolve(records);
            });
        })
    }

    // Function for opening and closing the accordion panels
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex;
        
        const currentIndexPosition = activeIndex.indexOf(index);
        if (currentIndexPosition > -1) {
            // If the clicked index number is already in the array, remove it
            newIndex.splice(currentIndexPosition, 1);
        } else {
            // Otherwise, add it
            newIndex.push(index);
        }
        // Use the spread operator to ensure the state reference is updated and the componenet re-renders
        setActiveIndex([...newIndex]);
    }

    const updateAnalyteList = (data) => {
        if (data) {
            // Pick a subset of columns rather than working with all columns = better performance and easier to work with
            const analyteRecords = data.map(d => {
                return { 
                    label: d.Analyte, 
                    value: d.Analyte + '$' + d.MatrixDisplay, 
                    matrix: d.MatrixDisplay, 
                    category1: d.AnalyteGroup1,
                    category2: d.AnalyteGroup2,
                    category3: d.AnalyteGroup3,
                    source: d.Source
                }
            })
            // Get unique objects from an array of objects based on object attribute value
            // https://yagisanatode.com/2021/07/03/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/
            const uniqueAnalytes = [...new Map(analyteRecords.map((item) => [item['value'], item])).values(),];
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
        updateAnalyte
    }) => {
        // Check that the data reference already exists; otherwise, this will run on intial load with the reference = null
        if (allAnalyteCombosRef.current) {
            // Get new data based on user selections
            let newData = allAnalyteCombosRef.current;
            if (program) {
                newData = newData.filter(d => d[capitalizeFirstLetter(program)] === 'True')
            }
            if (region) {
                newData = newData.filter(d => d['Region'] === region);
            }
            if (category) {
                newData = newData.filter(d => d.AnalyteGroup1 === category);
            }
            if (analyte) {
                newData = newData.filter(d => d.Analyte === analyte.label);
                newData = newData.filter(d => d.MatrixDisplay === analyte.matrix);
            }
            // Update select menu lists
            if (updateProgram) {
                updateProgramList(newData);
            }
            if (updateRegion) {
                updateRegionList(newData);
            }
            if (updateCategory) {
                updateCategoryList(newData);
            }
            if (updateAnalyte) {
                updateAnalyteList(newData);
            };
        }
    };

    useEffect(() => {
        if (program) {
            // If program is updated
            updateMenuOptions({ updateProgram: false, updateRegion: true, updateCategory: true, updateAnalyte: true });
        } else {
            // If program is cleared
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: true, updateAnalyte: true });
        }
    }, [program]);

    useEffect(() => {
        if (region) {
            // If region is updated
            updateMenuOptions({ updateProgram: true, updateRegion: false, updateCategory: true, updateAnalyte: true });
        } else {
            // If region is cleared
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: true, updateAnalyte: true });
        }
    }, [region]);

    useEffect(() => {
        if (category) {
            // If category is updated
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: false, updateAnalyte: true })
        } else {
            // If category is cleared
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: true, updateAnalyte: true });
        }
    }, [category]);

    useEffect(() => {
        if (analyte) {
            // If analyte is updated
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: true, updateAnalyte: false });
        } else {
            // If analyte is cleared
            setCategory(null);
            updateMenuOptions({ updateProgram: true, updateRegion: true, updateCategory: true, updateAnalyte: true });
        }
    }, [analyte]);

    return (
        <div>
            <Accordion 
                className={customAccordion}
                exclusive={false}
                fluid
                styled
            >
                {/* Filter */}
                <Accordion.Title
                    className={customTitle}
                    active={activeIndex.includes(0)}
                    index={0}
                    onClick={handleClick}
                >
                    <div className={titleWrapper}>
                        <div>
                            <Icon className={leadingIcon} name='filter' />
                            Filters
                        </div>
                        { activeIndex.includes(0) ? <Icon name='angle up' /> : <Icon name='angle down' /> }
                    </div>
                </Accordion.Title>
                <Accordion.Content active={activeIndex.includes(0)}>
                    <p className={pLabel} style={{ marginTop: '10px' }}>
                        Statewide monitoring program
                    </p>
                    <ProgramMenu program={program} programList={programList} setProgram={setProgram} />
                    <p className={pLabel}>
                        Region
                        <HelpIcon wide='very'>
                            <p>SWAMP’s regional assessments are planned and executed by each of the nine Regional Water Quality Control Boards. Each region identifies its own monitoring priorities and designs assessments to answer specific monitoring questions.</p>
                            <img src=".\rb-map.jpg" alt='Statewide map of regional water board boundaries' style={{ display: 'block', margin: 'auto', maxWidth: '300px' }} />
                            <p><a href="https://www.waterboards.ca.gov/publications_forms/publications/factsheets/docs/boardoverview.pdf" target="_blank" rel="noreferrer noopener">Source</a></p>
                        </HelpIcon>
                    </p>
                    <RegionMenu 
                        region={region}
                        regionList={regionList}
                        setRegion={setRegion} 
                    />
                    <p className={pLabel}>
                        Parameter
                    </p>
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
                            />
                        </div>
                    </div>
                    <div className={buttonContainer}>
                        {/* Bulk download */}
                        { analyte ? 
                            <BulkDownload
                                analyte={analyte}
                                program={program}
                                region={region}
                            />
                            : null
                        }
                        {/* Clear all filters */}
                        <ClearFilters 
                            setAnalyte={setAnalyte}
                            setCategory={setCategory}
                            setProgram={setProgram}
                            setRegion={setRegion}
                        />
                    </div>
                </Accordion.Content>
            </Accordion> 

            {/* Layers */}
            <Accordion 
                className={customAccordion}
                exclusive={false}
                fluid
                styled
            >
                <Accordion.Title
                    className={customTitle}
                    active={activeIndex.includes(1)}
                    index={1}
                    onClick={handleClick}
                >
                    <div className={titleWrapper}>
                        <div>
                            <Icon className={leadingIcon} name='map' />
                            Map Layers
                        </div>
                        { activeIndex.includes(1) ? <Icon name='angle up' /> : <Icon name='angle down' /> }
                    </div>
                </Accordion.Title>
                <Accordion.Content active={activeIndex.includes(1)}>
                    <div id="layerListContainer" />
                </Accordion.Content>
            </Accordion>
        </div>
    )
}