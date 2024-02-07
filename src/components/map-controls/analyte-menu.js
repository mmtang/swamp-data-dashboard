import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';
import Select from 'react-select';

import { matrixColor } from '../../constants/constants-app';
import { customSelectStyle } from '../../utils/utils';
import { pLabel } from './accordion-menu.module.css';

export default function AnalyteMenu({ 
    analyteList, 
    categoryList, 
    selectedAnalyte, 
    selectedCategory, 
    selectedSpecies,
    setSelectedAnalyte, 
    setSelectedCategory,
    setSelectedSpecies,
    speciesList
}) {
    const [loadingAnalyte, setLoadingAnalyte] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [loadingSpecies, setLoadingSpecies] = useState(true);

    const speciesDisabled = (selectedCategory !== 'Tissue' && selectedCategory !== 'Toxicity' && !selectedSpecies && (selectedAnalyte && (selectedAnalyte.source !== 'tissue' && selectedAnalyte.source !== 'toxicity')));

    const wrapperStyle = {
        marginBottom: '10px'
    }

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

    const handleAnalyteChange = (selection) => {
        // If there is a selection, the passed object is formatted as { label: 'fhab', value: 'fhab'}
        if (selection) {
            setSelectedAnalyte(selection);
        } else {
            setSelectedAnalyte(null);
        }
    }

    const handleCategoryChange = (selection) => {
        // The object passed to this function is formatted as { label: 'group', value: 'group'}
        // Will be null if the selection was cleared
        setSelectedAnalyte(null);
        setSelectedSpecies(null);
        if (selection) {
            setSelectedCategory(selection.value);
        } else {
            setSelectedCategory(null);
        }
    }

    const handleSpeciesChange = (selection) => {
        // The object passed to this function is formatted as { label: 'group', value: 'group'}
        // Will be null if the selection was cleared
        if (selection && selection.value) {
            setSelectedSpecies(selection);
        } else {
            setSelectedSpecies(null);
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
            <p className={pLabel}>Select analyte and/or species:</p>
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
                        value={selectedCategory ? { label: selectedCategory, value: selectedCategory } : null}
                    />
                </div>
            : <div style={wrapperStyle}><LoaderMenu /></div> }
            {/* Analyte/Parameter */}
            { !loadingAnalyte ? 
                <div style={wrapperStyle}>
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
                        value={selectedAnalyte ? selectedAnalyte : null}
                    />
                </div>
            : <LoaderMenu /> }
            {/* Species */}
            { !loadingSpecies ? 
                <div style={{ marginTop: '10px' }}>
                    <Select 
                        formatOptionLabel={formatOptionLabel}
                        isClearable={false}
                        isLoading={loadingSpecies}
                        isDisabled={speciesDisabled}
                        isSearchable={true}
                        maxMenuHeight={200}
                        onChange={handleSpeciesChange}
                        options={speciesList} 
                        styles={customSelectStyle}
                        value={selectedSpecies ? selectedSpecies : { label: 'All species', value: null }}
                    />
                </div>   
            : <div style={{ marginTop: '10px' }}><LoaderMenu /></div> }
        </div>
    )
}