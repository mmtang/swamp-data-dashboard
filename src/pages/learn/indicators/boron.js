import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Boron() {
    return (
        <LayoutParameter parameter={{ name: 'boron', display: 'Boron' }}>
            <div>
                <h2>What is Boron?</h2>
                <p>Boron is a widely occurring element found in rocks, soil, and water. It does not exist in the environment as a pure element but is often combined with oxygen to form a group of compounds called borates. These compounds are widely used as whitening agents and in the manufacturing of many different commercial products, including fiberglass, ceramics, washing agents, and fire retardants. Other common boron compounds include boric acid, sodium borate (borax), and boron oxide.</p>
                <h2>Why is it important to measure Boron?</h2>
                <p>Boron is essential for plant growth and may be a trace micronutrient, but at high concentrations it can have toxic effects on aquatic plants, invertebrates, fish, amphibians, and birds. The natural borate content of surface water and groundwater is usually small, but it can increase due to natural processes and human activities. Natural processes include the weathering of rocks and leaching of soils that contain borate and borosilicate materials.  Human activities, such as agriculture and wastewater discharges, can also contribute to the presence of boron in water.</p>
                <h2>References</h2>
                <p><a href="https://www.waterboards.ca.gov/gama/docs/coc_boron.pdf" target="_blank" rel="noreferrer noopener">California State Water Resources Control Board. 2017. Groundwater Information Sheet: Boron (B).</a></p>
                <p><a href="https://www.waterboards.ca.gov/centralvalley/water_issues/swamp/historic_reports/info_supt_rec_guidelines/boron_literature_sum_draft.pdf" target="_blank" rel="noreferrer noopener">Central Valley Regional Water Quality Control Board. 2000. Boron: A Literature Summary for Developing Water Quality Objectives.</a></p>
                <p><a href="https://www.epa.gov/sites/default/files/2014-09/documents/summary_document_from_the_ha_for_boron.pdf" target="_blank" rel="noreferrer noopener">United States Environmental Protection Agency (U.S. EPA). 2008. Drinking Water Health Advisory for Boron and Compounds. Prepared by Health and Ecological Criteria Division (HECD), Office of Science and Technology (OST), Office of Water (OW) for Office of Groundwater/Drinking Water (OGWDW), OW, U.S. EPA.</a></p>
            </div>
        </LayoutParameter>
    )
}