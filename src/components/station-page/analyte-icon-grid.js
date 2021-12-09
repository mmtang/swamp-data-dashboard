import React from 'react';
import ParameterIcon from '../icons/parameter-icon';
import { analytes } from '../../utils/constants';
import { grid, iconContainer, iconWrapper, label } from './analyte-icon-grid.module.css';

export default function AnayteIconGrid({ selectedAnalytes }) {    
    return (
        <div className={grid}>
            { selectedAnalytes.map(analyteName => 
                <div className={iconContainer}>
                    <div className={iconWrapper}><a href={`/learn/indicators/${analytes[analyteName].page}`} target='_blank' rel='noreferrer noopener'><ParameterIcon icon={analytes[analyteName].code} fill='#e3e4e6' stroke='#5d5d5d' size={55} /></a></div>
                    <div className={label}>{analytes[analyteName].label}</div>
                </div>
            )}
        </div>
    )
}