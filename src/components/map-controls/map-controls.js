import React from 'react';
import { boxContainer, selectWrapper } from './map-controls.module.css';

export default function MapControls() {
    const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?sql=SELECT%20DISTINCT%20%22Analyte%22%20from%20%22555ee3bf-891f-4ac4-a1fc-c8855cf70e7e%22%20ORDER%20BY%20%22Analyte%22%20ASC';

    return (
        <div className={boxContainer}>
            Or select a <span className="emphasis">water quality parameter</span>
            <div className={selectWrapper}>
                
            </div>
        </div>
    )
}