import React from 'react';
import RegionMenu from './region-menu';
import AnalyteMenu from './analyte-menu';
import { IconSearch } from '@tabler/icons';
import { container, containerItem, searchWrapper, indexSearch, iconWrapper } from './controls-container.module.css';


export default function ControlsContainer({ globalFilter, setGlobalFilter, selectedRegion, setRegion, selectedAnalyte, setAnalyte }) {   

    return (
        <div className={container}>
            <div className={containerItem} style={{ flex: '1', marginRight: '8px' }}>
                <div className={searchWrapper}>
                    <input
                        className={indexSearch}
                        type="text"
                        placeholder="Search site table"
                        value={globalFilter || ""}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                    <span className={iconWrapper}>
                        <IconSearch size={18} />
                    </span>
                </div>
            </div>
            <div className={containerItem} style={{ flex: '1' }}>
                <RegionMenu selectedRegion={selectedRegion} setRegion={setRegion} />
            </div>
            <div className={containerItem} style={{ flex: '1', marginRight: '0' }}>
                <AnalyteMenu selectedAnalyte={selectedAnalyte} setAnalyte={setAnalyte} />
            </div>
        </div>
    )
}