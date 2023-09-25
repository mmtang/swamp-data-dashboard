import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';
import Select from 'react-select';

import { matrixColor } from '../../constants/constants-app';
import { customSelectStyle } from '../../utils/utils';

export default function AnalyteMenu({ 
    analyte, 
    analyteList, 
    category, 
    categoryList, 
    setAnalyte, 
    setCategory,
    setSpecies,
    species,
    speciesList
}) {
    const [loadingAnalyte, setLoadingAnalyte] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [loadingSpecies, setLoadingSpecies] = useState(true);

    const wrapperStyle = {
        marginBottom: '10px'
    }

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

    const handleAnalyteChange = (selection) => {
        // If there is a selection, the passed object is formatted as { label: 'fhab', value: 'fhab'}
        if (selection) {
            setAnalyte(selection);
        } else {
            setAnalyte(null);
        }
    }

    const handleCategoryChange = (selection) => {
        // The object passed to this function is formatted as { label: 'group', value: 'group'}
        // Will be null if the selection was cleared
        setAnalyte(null);
        setSpecies(null);
        if (selection) {
            setCategory(selection.value);
        } else {
            setCategory(null);
        }
    }

    const handleSpeciesChange = (selection) => {
        // The object passed to this function is formatted as { label: 'group', value: 'group'}
        // Will be null if the selection was cleared
        if (selection) {
            setSpecies(selection.value);
        } else {
            setSpecies(null);
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

    useEffect(() => {
        if (speciesList) {
            setLoadingSpecies(false);
        }
    }, [speciesList]);

    return (
        <div>
            {/* Category Menu */}
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
            {/* Species */}
            { category === 'Toxicity' || category === 'Tissue' || species || (analyte && ((analyte.source === 'tissue') || (analyte.source === 'toxicity')) ) ?
              <div style={wrapperStyle}>
                    <Select 
                        options={speciesList} 
                        isClearable={true}
                        isLoading={loadingSpecies}
                        isSearchable={true}
                        placeholder='All species'
                        onChange={handleSpeciesChange}
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        value={species ? { label: species, value: species } : null}
                    />
              </div>    
            : null }
            {/* Analyte/Parameter */}
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