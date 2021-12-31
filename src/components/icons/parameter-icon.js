import React from 'react';
import Asci from './parameters/asci';
import Boron from './parameters/boron';
import Csci from './parameters/csci';
import Conductivity from './parameters/conductivity';
import DissolvedOxygen from './parameters/dissolved_oxygen';
import Ecoli from './parameters/ecoli';
import Fluoride from './parameters/fluoride';
import Ipi from './parameters/ipi';
import Ph from './parameters/ph';
import Tds from './parameters/tds';
import Temperature from './parameters/temperature';
import TotalKjeldahlNitrogen from './parameters/total_kjeldahl_nitrogen';
import TotalNitrogen from './parameters/total_nitrogen';
import TotalPhosphorus from './parameters/total_phosphorus';
import Turbidity from './parameters/turbidity';

export default function ParameterIcon(props) {
    const icon = props.icon;
    const size = props.size || 40;  // 40px is the default/fallback value
    const fill = props.fill || '#2185d0';
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
            case 'asci':
                return <Asci props={newProps} />
            case 'boron':
                return <Boron props={newProps} />
            case 'conductivity':
                return <Conductivity props={newProps} />
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
            case 'ph':
                return <Ph props={newProps} />
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
            default: 
              return <Temperature props={newProps} />;
        }
    }

    return (
        getComponent()
    )
}