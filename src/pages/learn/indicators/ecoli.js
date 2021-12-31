import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Ecoli() {
    return (
        <LayoutParameter parameter={{ name: 'ecoli', display: 'E. coli' }}>
            <div>
                <h2>What is E. coli?</h2>
                <p><i>Escherichia coli</i>, or <i>E. coli</i>, is a type of bacteria found in the intestines and fecal waste of animals and humans. It is a member of the fecal coliform group of bacteria, which is a subgroup of total coliform bacteria. Most strains of <i>E. coli</i> bacteria are harmless; however, some strains can cause illness  in humans.</p>
                <h2>Why is it important to measure E. coli?</h2>
                <p><i>E. coli</i> is widely used as an indicator of water quality. The presence of <i>E. coli</i> bacteria in surface waters strongly indicates recent contamination from animal and/or human fecal waste. Possible sources of contamination include wastewater treatment plants, septic systems, sewer pipe breaks/leaks, and storm runoff. High numbers of <i>E. coli</i> also indicate the presence of other harmful bacteria and disease-causing organisms, such as viruses and protozoans.</p>
                <p><i>E. coli</i> is one of the most reliable indicators of health risk from water contact in recreational waters. Ingestion of or contact with contaminated water can cause gastrointestinal illness, nausea, or infections of the eye, ear, nose, or throat. Most healthy individuals can recover on their own, but those with compromised immune systems are at higher risk and can develop severe illnesses.</p>
                <h2>How do I interpret the data?</h2>
                <p>The State Water Resources Control Board <a href="https://www.waterboards.ca.gov/bacterialobjectives/" target="_blank" rel="noreferrer noopener">bacterial objectives</a> outline the statewide water quality objectives for <i>E. coli</i> in all surface waters, enclosed bays, and estuaries that have the water contact recreational beneficial use (REC-1).</p>
                <p>A Regional Water Quality Control Board (Regional Water Board) might have region, waterbody, or site-specific water quality objectives for <i>E. coli</i>. These objectives are outlined in the Regional Water Board's Water Quality Control Plan (Basin Plan).</p>
                <h2>References</h2>
                <p><a href="https://archive.epa.gov/water/archive/web/html/vms511.html" target="_blank" rel="noreferrer noopener">U.S. Environmental Protection Agency. Water: Monitoring & Assessment: Fecal Bacteria.</a></p>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/bacteria-and-e-coli-water" target="_blank" rel="noreferrer noopener">U.S. Geological Survey. 2018. Bacteria and E. coli in Water.</a></p>
            </div>
        </LayoutParameter>
    )
}