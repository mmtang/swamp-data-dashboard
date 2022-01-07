import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Ph() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'ph', display: 'pH' }}>
            <div>
                <h2>What is pH?</h2>
                <p>pH is a measure of how acidic or basic water is, based on the amount of free hydrogen and hydroxyl ions in the water. It is measured on a scale of 0 to 14, with 7 being neutral. Substances with a pH of less than 7 are considered acidic, and substances with a pH of greater than 7 are considered basic. The pH scale is logarithmic, meaning that a change of one point represents a ten-fold increase in acidity or alkalinity. The pH level affects the chemical and biological processes in water, and is important to the survival and growth of aquatic life in a waterbody.</p> 
                <h2>Why is it important?</h2>
                <p>pH determines the solubility (ability to dissolve) and chemical state of many pollutants and substances in water. This affects the biological availability and toxicity of these substances to the organisms living in the waterbody. For example, changes in the pH of water can increase the solubility of nutrients like phosphorus and make them more accessible for plant growth. It can also increase the solubility of heavy metals like cadmium and lead, and make them more toxic to fish and other organisms living in the waterbody.</p>
                <p>Excessively high or low pH levels, or fluctuating pH levels outside of the normal range, can have negative impacts on the health of a waterbody and its aquatic community. Fish and other aquatic organisms are adapted to different ranges of pH, with most organisms falling within an optimal range of pH 6.5-8.5. Even small changes to the pH level in a waterbody can stress many species and negatively impact their growth and reproduction. Sustained levels outside of the normal range can shift the composition of the aquatic community and reduce biological diversity.</p>
                <h2>How do I interpret the data?</h2>
                <p>In general, the optimal range of pH for most aquatic organisms is <strong>6.5-8.5</strong>. The lower and/or upper limit may differ depending on the type of waterbody and species present.</p>
                <p>There are no statewide water quality objectives for pH. A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for pH and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p> 
                <h2>References</h2>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/bacteria-and-e-coli-water" target="_blank" rel="noreferrer noopener">U.S. Environmental Protection Agency. CADDIS Volume 2: pH.</a></p>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/bacteria-and-e-coli-water" target="_blank" rel="noreferrer noopener">U.S. Geological Survey. 2019. pH and Water.</a></p>
            </div>
        </LayoutParameter>
    )
}

