import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Conductivity() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'conductivity', display: 'Conductivity' }}>
            <div>
                <h2>What is Conductivity?</h2>
                <h2>Why is it important to measure Conductivity?</h2>
            </div>
        </LayoutParameter>
    )
}

