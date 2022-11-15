import React, { useEffect, useState } from 'react';
import LoaderMenu from './loader-menu';

import Select from 'react-select';

import { matrixColor } from '../../constants/constants-app';
import { customSelectStyle } from '../../utils/utils';


export default function AnalyteMenu({ analyte, analyteList, category, categoryList, setAnalyte, setCategory  }) {
    const [loadingAnalyte, setLoadingAnalyte] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true);

    const wrapperStyle = {
        marginBottom: '10px'
    }

    /*
    const createAnalyteParams = (resource) => {
        let querySql = `SELECT DISTINCT ON ("Analyte", "MatrixDisplay", "AnalyteGroup1") "Analyte", "MatrixDisplay", "AnalyteGroup1" FROM "${resource}"`;
        if (program || region) {
            // This block constucts the "WHERE" part of the select query
            // There can be one or two filters
            const additions = [];
            if (program) {
                additions.push(`"${capitalizeFirstLetter(program)}" = 'True'`)
            }
            if (region) {
                additions.push(`"Region" = ${region}`)
            }
            const concat = additions.join(' AND ');
            querySql += ' WHERE ';
            querySql += concat;
        }
        querySql += ` ORDER BY "Analyte" ASC`;
        return { resource_id: resource, sql: querySql };
    }
    */

    const formatOptionLabel = ({ value, label, matrix }) => {
        const boxColor = matrixColor[matrix] ? matrixColor[matrix] : matrixColor['other'];
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '80px', minWidth: '80px', marginRight: '10px', padding: '0 6px', borderRadius: '0', fontSize: '12px', backgroundColor: `${boxColor}`, color: '#fff' }}>
                    {matrix}
                </div>
                <div style={{ fontSize: '14px', overflowWrap: 'break-word' }}>{label}</div>
            </div>
        )
    };

    /*
    const getAllAnalyteOptions = () => {
        return new Promise((resolve, reject) => {
            const chemParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "AnalyteGroup1", "MatrixName", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "AnalyteGroup1", "MatrixName", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e"`
            }
            const habitatParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "AnalyteGroup1", "MatrixName", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "AnalyteGroup1", "MatrixName", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "6d9a828a-d539-457e-922c-3cb54a6d4f9b"`
            };
            const toxParams = {
                sql: `SELECT DISTINCT ON ("Analyte", "AnalyteGroup1", "MatrixName", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region") "Analyte", "AnalyteGroup1", "MatrixName", "Bioaccumulation", "Bioassessment", "Fhab", "Spot", "Region" FROM "a6dafb52-3671-46fa-8d42-13ddfa36fd49"`
            }
            Promise.all([
                getData(chemParams),
                getData(habitatParams),
                getData(toxParams)
            ]).then((res) => {
                const allOptions = res[0].concat(res[1], res[2]);
                resolve(allOptions);
            });
        });
    }
    */

    /*
    const getAnalyteOptions = () => {
        return new Promise((resolve, reject) => {
            const chemParams = createAnalyteParams(chemistryResourceId);
            const habitatParams = createAnalyteParams(habitatResourceId);
            const toxParams = createAnalyteParams(toxicityResourceId);
            Promise.all([
                getData(chemParams),
                getData(habitatParams),
                getData(toxParams)
            ]).then((res) => {
                const allRecords = res[0].concat(res[1], res[2]);
                // *** Analytes
                const analytes = allRecords.map(d => { 
                    return { label: d.Analyte, value: d.Analyte, matrix: d.MatrixDisplay, category: d.AnalyteGroup1 };
                });
                // *** Categories
                const allCategories = allRecords.map(d => d.AnalyteGroup1);
                // Get list of unique categories, sorted asc
                const uniqueCategories = [...new Set(allCategories)];
                uniqueCategories.sort();
                // Build array of objects for the select menu
                const categories = uniqueCategories.map(d => {
                    return {label: d, value: d};
                });
                resolve([analytes, categories]);
            });
        })
    };
    */

    /*
    const getData = (params) => {
        return new Promise((resolve, reject) => {
            const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            console.log(url + new URLSearchParams(params));
            fetch(url + new URLSearchParams(params))
            .then((resp) => resp.json())
            .then((json) => json.result.records)
            .then((records) => {
              resolve(records);
            });
        })
    }
    */

    const handleCategoryChange = (selection) => {
        // The object passed to this function is formatted as { label: 'group', value: 'group'}
        // Will be null if the selection was cleared
        if (selection) {
            setCategory(selection.value);
        } else {
            setCategory(null);
        }
    }

    const handleAnalyteChange = (selection) => {
        // If there is a selection, the passed object is formatted as { label: 'fhab', value: 'fhab'}
        if (selection) {
            setAnalyte(selection);
        } else {
            setAnalyte(null);
        }
    }

    useEffect(() => {
        if (analyteList) {
            setLoadingAnalyte(false);
        }
    }, [analyteList]);

    useEffect(() => {
        if (categoryList) {
            setLoadingCategory(false);
        }
    }, [categoryList]);

    return (
        <div>
            { !loadingCategory ? 
                <div style={wrapperStyle}>
                    <Select
                        options={categoryList} 
                        isClearable={true}
                        isLoading={loadingCategory}
                        isSearchable={true}
                        placeholder='Category'
                        onChange={handleCategoryChange}
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        value={category ? { label: category, value: category } : null}
                    />
                </div>
            : <div style={wrapperStyle}><LoaderMenu /></div> }
            { !loadingAnalyte ? 
                <Select
                    isClearable={true}
                    isLoading={loadingAnalyte}
                    isSearchable={true}
                    placeholder='Parameter'
                    onChange={handleAnalyteChange}
                    options={analyteList} 
                    styles={customSelectStyle}
                    maxMenuHeight={200}
                    formatOptionLabel={formatOptionLabel}
                    value={analyte ? analyte : null}
                />
            : <LoaderMenu /> }
        </div>
    )
}