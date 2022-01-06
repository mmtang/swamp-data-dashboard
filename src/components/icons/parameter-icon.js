import React from 'react';
import Aluminum from './parameters/aluminum';
import Arsenic from './parameters/arsenic';
import Asci from './parameters/asci';
import Barium from './parameters/barium';
import Beryllium from './parameters/beryllium';
import Boron from './parameters/boron';
import Cadmium from './parameters/cadmium';
import Chloride from './parameters/chloride';
import Chromium from './parameters/chromium';
import Copper from './parameters/copper';
import Csci from './parameters/csci';
import Conductivity from './parameters/conductivity';
import DissolvedOxygen from './parameters/dissolved_oxygen';
import Ecoli from './parameters/ecoli';
import Fluoride from './parameters/fluoride';
import Ipi from './parameters/ipi';
import Lead from './parameters/lead';
import Manganese from './parameters/manganese';
import Nickel from './parameters/nickel';
import Ph from './parameters/ph';
import Selenium from './parameters/selenium';
import Silver from './parameters/silver';
import Tds from './parameters/tds';
import Temperature from './parameters/temperature';
import TotalKjeldahlNitrogen from './parameters/total_kjeldahl_nitrogen';
import TotalNitrogen from './parameters/total_nitrogen';
import TotalPhosphorus from './parameters/total_phosphorus';
import Turbidity from './parameters/turbidity';
import Zinc from './parameters/zinc';

export default function ParameterIcon(props) {
    const icon = props.icon;
    const size = props.size || 40;  // 40px is the default/fallback value
    const fill = props.fill || '#20639b';
    const stroke = props.stroke || '#ffffff';

    // Apply default props if needed
    const newProps = {
        icon,
        size,
        fill,
        stroke
    }

    const getComponent = () => {
        switch(icon) {
            case 'aluminum':
                return <Aluminum props={newProps} />
            case 'arsenic': 
                return <Arsenic props={newProps} />
            case 'asci':
                return <Asci props={newProps} />
            case 'barium':
                return <Barium props={newProps} />
            case 'beryllium':
                return <Beryllium props={newProps} />
            case 'boron':
                return <Boron props={newProps} />
            case 'cadmium':
                return <Cadmium props={newProps} />
            case 'chloride':
                return <Chloride props={newProps} />
            case 'chromium':
                return <Chromium props={newProps} />
            case 'conductivity':
                return <Conductivity props={newProps} />
            case 'copper':
                return <Copper props={newProps} />
            case 'csci':
                return <Csci props={newProps} />
            case 'dissolvedOxygen':
                return <DissolvedOxygen props={newProps} />
            case 'ecoli':
                return <Ecoli props={newProps} />
            case 'fluoride':
                return <Fluoride props={newProps} />
            case 'ipi':
                return <Ipi props={newProps} />
            case 'lead':
                return <Lead props={newProps} />
            case 'manganese':
                return <Manganese props={newProps} />
            case 'nickel':
                return <Nickel props={newProps} />
            case 'ph':
                return <Ph props={newProps} />
            case 'selenium':
                return <Selenium props={newProps} />
            case 'silver':
                return <Silver props={newProps} />
            case 'tds': 
                return <Tds props={newProps} />;
            case 'temperature': 
              return <Temperature props={newProps} />;
            case 'tkn': 
              return <TotalKjeldahlNitrogen props={newProps} />;
            case 'totalNitrogen': 
              return <TotalNitrogen props={newProps} />;
            case 'totalPhosphorus': 
              return <TotalPhosphorus props={newProps} />;
            case 'turbidity': 
              return <Turbidity props={newProps} />;
            case 'zinc':
                return <Zinc props={newProps} />;
            default: 
              return <Temperature props={newProps} />;
        }
    }

    return (
        getComponent()
    )
}