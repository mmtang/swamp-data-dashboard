import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Temperature() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'temperature', display: 'Temperature' }}>
            <div>
                <h2>What is Temperature?</h2>
                <p>Water temperature measures how hot or cold water is. It exerts a major influence on biological activity and growth, has an effect on water chemistry, can influence water quantity measurements, and governs the kinds of organisms that live in water bodies.</p>
                <h2>Why is it important to measure Temperature?</h2>
                <p>Temperature exerts a major influence on biological activity and growth. Temperature governs the kinds of organisms that can live in rivers and lakes. Fish, insects, zooplankton, phytoplankton, and other aquatic species all have a preferred temperature range. As temperatures get too far above or below this preferred range, the number of individuals of the species decreases until finally there are none.</p>
                <p>Warm stream water is can affect the aquatic life in the stream. Warm water holds less dissolved oxygen than cool water, and may not contain enough dissolved oxygen for the survival of different species of aquatic life. Some compounds are also more toxic to aquatic life at higher temperatures.</p>
            </div>
        </LayoutParameter>
    )
}

