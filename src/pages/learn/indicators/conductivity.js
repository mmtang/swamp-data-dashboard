import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Conductivity() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'conductivity', display: 'Conductivity' }}>
            <div>
                <h2>What is Conductivity?</h2>
                <p>Conductivity, or specific conductivity, is a measure of the ability of water to pass an electrical current. It is directly related to the amount and activity of ions in the water. In general, the more dissolved materials (such as salts) in water, the higher its ionic content (conductivity). Temperature also affects conductivity. Warmer temperatures increase ionic activity, which increases conductivity.</p>
                <h2>Why is it important to measure Conductivity?</h2>
                <p>Conductivity is a useful indicator of water quality because it is an indirect measure of the presence of pollutants in water. Waterbodies have a relatively constant and predictable range of conductivity. Any significant changes seen over time can indicate some contamination or disturbance to the waterbody. Some of these pollutants are harmful to aquatic life at high concentrations.</p>
                <p>Conductivity is affected by both natural processes and human activities. The geology of an area (and where water flows) has a large effect on conductivity readings. For example, dissolving rocks and other organic material can release naturally-occurring salt into a waterbody, which increases conductivity. Human activities tend to greatly increase the amount of dissolved substances entering a waterbody. These sources of pollution include agricultural runoff, urban runoff, and acid mine drainage.</p>
                <h2>References</h2>
                <p><a href="https://www.waterboards.ca.gov/gama/docs/coc_salinity.pdf" target="_blank" rel="noreferrer noopener">California State Water Resources Control Board. 2017. Groundwater Information Fact Sheet: Salinity.</a></p>
                <p><a href="https://www.epa.gov/national-aquatic-resource-surveys/indicators-conductivity" target="_blank" rel="noreferrer noopener">United States Environmental Protection Agency (U.S. EPA). Indicators: Conductivity</a></p>
            </div>
        </LayoutParameter>
    )
}

