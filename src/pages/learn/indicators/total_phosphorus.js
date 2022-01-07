import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function TotalPhosphorus() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'totalPhosphorus', display: 'Total Phosphorus' }}>
            <div>
                <h2>What is Total Phosphorus?</h2>
                <p>Phosphorus is a naturally-occurring element and an essential nutrient for plants and animals. Pure, elemental phosphorus is rare. It mostly exists in the form of phosphate. In surface waters, phosphorus is usually measured as orthophosphate and total phosphorus. Orthophosphate is a form of phosphorus that is more available to plants. Total phosphorus refers to the sum of orthophosphate, condensed (inorganic) phosphate, and organic phosphate. Total phosphorus is an important indicator of nutrient pollution in a waterbody.</p>
                <h2>Why is it important?</h2>
                <p>Phosphorus, like <Link to='../total_nitrogen'>nitrogen</Link>, is an important nutrient for the growth and survival of aquatic organisms. In most surface waters, phosphorus is the limiting nutrient, meaning that the amount of phosphorus often has a direct effect on the population size of plants and algae in a waterbody. Phosphorus occurs naturally in the environment at low levels, but too much of it can lead to a rapid growth of plants and algae, which is a precursor to depleted <Link to='../dissolved_oxygen'>dissolved oxygen</Link> levels and eutrophication. Eutrophication can lead to serious public and environmental health problems such as harmful algal blooms, fish kills, and "dead zones."</p>
                <p>A common source of nutrient pollution in surface water is agricultural and urban runoff. Phosphorus is a common ingredient in commercial fertilizers, which are widely used in agricultural, urban, and residential environments. Runoff with excess fertilizer can flow into a nearby waterbody, dump a large amount of nutrients into the water, and accelerate the eutrophication process. Wastewater and industrial discharges can also contribute to high levels of phosphorus in a waterbody.</p>
                <h2>How do I interpret the data?</h2>
                <p>The State Water Resources Control Board is considering statewide water quality objectives for <a href='https://www.waterboards.ca.gov/water_issues/programs/biostimulatory_substances_biointegrity/' target='_blank' rel='noreferrer noopener'>nutrients and other biostimulatory substances</a>.</p>
                <p>A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for phosphorus and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p>
                <h2>References</h2>
                <p><a href="https://archive.epa.gov/water/archive/web/html/vms56.html" target="_blank" rel="noreferrer noopener">U.S. Environmental Protection Agency. 2012. Phosphorus. In Water: Monitoring & Assessment.</a></p>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/phosphorus-and-water" target="_blank" rel="noreferrer noopener">U.S. Geological Survey, Water Science School. 2018. Phosphorus and Water.</a></p>
            </div>
        </LayoutParameter>
    )
}

