import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function TotalNitrogen() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'totalNitrogen', display: 'Total Nitrogen' }}>
            <div>
                <h2>What is Total Nitrogen?</h2>
                
                <h2>Why is it important to measure Total Nitrogen?</h2>
                
            </div>
        </LayoutParameter>
    )
}

