import React from 'react';
import Asci from './parameters/asci';
import Csci from './parameters/csci';
import Temperature from './parameters/temperature';
import Turbidity from './parameters/turbidity';

export default function ParameterIcon(props) {
    const icon = props.icon;
    const size = props.size || 40;  // 40px is the default/fallback value
    const fill = props.fill || '#1e70bf';
    const stroke = props.stroke || '#ffffff';

    // Apply default props if needed
    const newProps = {
        icon,
        size,
        fill,
        stroke
    }

    console.log(newProps);

    const getComponent = () => {
        switch(icon) {
            case 'asci':
                return <Asci props={newProps} />
            case 'csci':
                return <Csci props={newProps} />
            case 'temperature': 
              return <Temperature props={newProps} />;
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