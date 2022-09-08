import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { customSelectStyle } from '../../utils/utils';

import { menuContainer, wrapper } from './spot-menu.module.css';


export default function SpotMenu({ setStationData, setAnalyte, setRegion }) {   
    // All analytes
    const analytesRef = useRef(null);
    // Subgroups of analytes
    const [fieldList, setFieldList] = useState(null);
    const [metalList, setMetalList] = useState(null);
    const [pahList, setPahList] = useState(null);
    const [pbdeList, setPbdeList] = useState(null);
    const [pcbList, setPcbList] = useState(null);
    const [fipronilList, setFipronilList] = useState(null);
    const [organoChList, setOrganoChList] = useState(null);
    const [organoPhList, setOrganoPhList] = useState(null);
    const [pyrethroidList, setPyrethroidList] = useState(null);
    // Select menus
    const selectFieldRef = useRef(null);
    const selectMetalRef = useRef(null);
    const selectOrganicRef = useRef(null);
    const selectPesticideRef = useRef(null);

    // Matrix colors
    const sedimentColor = '#917c78';
    const waterColor = '#0081a7';

    // Initial load
    useEffect(() => {
        // Get analytes data for populating the select elements
        getAllAnalytes();
    }, [])

    const getAllAnalytes = () => {
        // Analyte count as of 8/22/22 is 214
        const url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e&distinct=true&fields=MatrixName%2CAnalyte%2CAnalyteCategory&limit=500'; 
        fetch(url)
            .then((resp) => resp.json())
            .then((json) => json.result.records)
            .then((records) => {
                if (records) {
                    analytesRef.current = (getAnalyteList(records, null));
                    setFieldList(getAnalyteList(records, 'Conventional/Field'));
                    setMetalList(getAnalyteList(records, 'Metal'));
                    setPahList(getAnalyteList(records, 'PAH'));
                    setPbdeList(getAnalyteList(records, 'PBDE'));
                    setPcbList(getAnalyteList(records, 'PCB'));
                    setFipronilList(getAnalyteList(records, 'Fipronil'));
                    setOrganoChList(getAnalyteList(records, 'Organochlorine'));
                    setOrganoPhList(getAnalyteList(records, 'Organophosphate'));
                    setPyrethroidList(getAnalyteList(records, 'Pyrethroid'));
                } else {
                    console.error('No analyte data returned');
                }
            });
    }

    const getAnalyteList = (data, category) => {
        // Filter by analyte category and sort in alphabetical ascending order by analyte name
        // Use localeCompare: https://stackoverflow.com/questions/51165/how-to-sort-strings-in-javascript
        const records = data.filter(d => d.AnalyteCategory === category).sort((a, b) => a.Analyte.localeCompare(b.Analyte));
        // Construct data object for select element in { label: x, value: x } format
        const list = records.map(d => {
            return {
                label: d.Analyte,
                value: d.Analyte,
                matrix: d.MatrixName
            };
        });
        return list;
    }

    const formatOptionLabel = ({ value, label, matrix }) => {
        const matrixColor = matrix === 'samplewater' ? waterColor : 
            matrix === 'sediment' ? sedimentColor : 
            '#000';
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px', marginRight: '10px', padding: '0 6px', borderRadius: '0', fontSize: '12px', backgroundColor: `${matrixColor}`, color: '#fff' }}>
                    {matrix}
                </div>
                <div style={{ fontSize: '14px' }}>{label}</div>
            </div>
        )
    };

    const formatGroupLabel = (data) => {
        return (
            <div style={{ textTransform: 'capitalize', color: '#323232', fontSize: '15px', fontWeight: '600' }}>
                {data.label}
            </div>
        )
    }

    const pesticideList = [
        {
            label: 'Fipronil',
            options: fipronilList
        },
        {
            label: 'Organochlorines',
            options: organoChList
        },
        {
            label: 'Organophosphates',
            options: organoPhList
        },
        {
            label: 'Pyrethroids',
            options: pyrethroidList
        }
    ]

    const organicList = [
        {
            label: 'Polycyclic aromatic hydrocarbons (PAHs)',
            options: pahList
        },
        {
            label: 'Polybrominated diphenyl ethers (PBDEs)',
            options: pbdeList
        },
        {
            label: 'Polychlorinated biphenyls (PCBs)',
            options: pcbList
        }
    ]

    const handleChangeField = (selection, triggeredAction) => {
        console.log(selection);
        console.log(triggeredAction);
        if (selection) {
            // If user selected an analyte:
            // Clear other filters
            selectMetalRef.current.select.clearValue();
            selectOrganicRef.current.select.clearValue();
            selectPesticideRef.current.select.clearValue();
            // Change state
            const value = selection.value;
            setAnalyte({ type: 'wq', name: value });
        } else {
            setAnalyte(null);
        }
    }

    const handleChangeMetal = (selection, triggeredAction) => {
        if (selection) {
            // Clear other filters
            selectFieldRef.current.select.clearValue();
            selectOrganicRef.current.select.clearValue();
            selectPesticideRef.current.select.clearValue();
            // Change state
            const value = selection.value;
            setAnalyte({ type: 'wq', name: value });
        } else {
            setAnalyte(null);
        }
    }

    const handleChangeOrganic = (selection) => {
        if (selection) {
            // Clear other filters
            selectFieldRef.current.select.clearValue();
            selectMetalRef.current.select.clearValue();
            selectPesticideRef.current.select.clearValue();
            // Change state
            const value = selection.value;
            setAnalyte({ type: 'wq', name: value });
        } else {
            setAnalyte(null);
        }
    }

    const handleChangePesticide = (selection) => {
        if (selection) {
            // Clear other filters
            selectFieldRef.current.select.clearValue();
            selectMetalRef.current.select.clearValue();
            selectOrganicRef.current.select.clearValue();
            // Change state
            const value = selection.value;
            setAnalyte({ type: 'wq', name: value });
        } else {
            setAnalyte(null);
        }
    }

    return (
        <div>
            <div className={menuContainer}>
                <strong>Contaminant / Parameter</strong>
                <div className={wrapper}>
                    <Select
                        ref={selectFieldRef}
                        options={fieldList} 
                        isClearable={true}
                        isSearchable={true}
                        placeholder='Conventional, Field'
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        formatOptionLabel={formatOptionLabel}
                        onChange={handleChangeField}
                    />
                </div>
                <div className={wrapper}>
                    <Select
                        ref={selectMetalRef}
                        options={metalList} 
                        isClearable={true}
                        isSearchable={true}
                        placeholder='Metals'
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        formatOptionLabel={formatOptionLabel}
                        onChange={handleChangeMetal}
                    />
                </div>
                <div className={wrapper}>
                    <Select
                        ref={selectOrganicRef}
                        options={organicList} 
                        isClearable={true}
                        isSearchable={true}
                        placeholder='PAHs, PBDEs, PCBs'
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        formatOptionLabel={formatOptionLabel}
                        formatGroupLabel={formatGroupLabel}
                        onChange={handleChangeOrganic}
                    />
                </div>
                <div className={wrapper}>  
                    <Select
                        ref={selectPesticideRef}
                        options={pesticideList} 
                        isClearable={true}
                        isSearchable={true}
                        placeholder='Pesticides'
                        styles={customSelectStyle}
                        maxMenuHeight={200}
                        formatOptionLabel={formatOptionLabel}
                        formatGroupLabel={formatGroupLabel}
                        onChange={handleChangePesticide}
                    />
                </div>
            </div>
            <div className={menuContainer}>
                <strong>Toxicity</strong>

            </div>
        </div>
    )
}