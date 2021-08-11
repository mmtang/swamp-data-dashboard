import React from 'react';
import RegionMenu from './region-menu';
import AnalyteMenu from './analyte-menu';
import FilterByExtent from './filter-by-extent';
import { container, containerItem } from './controls-container.module.css';


export default function ControlsContainer({ selectedRegion, setRegion, selectedAnalyte, setAnalyte, setFilterExtentToggle }) {   

    return (
        <div className={container}>
            <div className={containerItem} style={{ flex: '1' }}>
                <RegionMenu selectedRegion={selectedRegion} setRegion={setRegion} />
            </div>
            <div className={containerItem} style={{ flex: '1', marginRight: '0' }}>
                <AnalyteMenu selectedAnalyte={selectedAnalyte} setAnalyte={setAnalyte} />
            </div>
        </div>
    )
}