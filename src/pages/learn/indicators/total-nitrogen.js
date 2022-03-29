import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';
import Metadata from '../../../components/layout/metadata';

export default function TotalNitrogen() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'totalNitrogen', display: 'Total Nitrogen' }}>
            <Metadata title='Total Nitrogen' />
            <div>
                <h2>What is Total Nitrogen?</h2>
                <p>Nitrogen is a chemical element that is ubiquitous in the environment. It is an essential nutrient for plants and animals, but too much of it can have adverse ecological effects on a waterbody. Total nitrogen refers to the sum of nitrate, nitrite, and total kjeldahl nitrogen (combined organic nitrogen and ammonia + ammonium). Nitrate is a form of nitrogen that is more available to plants and dominant in most surface waters. Nitrite is a less stable form of nitrogen and a by-product of ammonium transformed into nitrate. </p>
                <h2>Why is it important to measure Total Nitrogen?</h2>
                <p>Nitrogen, like <Link to='/learn/indicators/total-phosphorus'>phosphorus</Link>, is an essential nutrient for plants and animals. Nutrients occur naturally in freshwater and saltwater, but an overabundance of nutrients can cause excessive plant growth. The rapid growth of these plants can block sunlight from penetrating the water and also use up the <Link to='/learn/indicators/dissolved-oxygen'>dissolved oxygen</Link> in water, depriving other oxygen-dependent organisms living in the waterbody. This condition, called eutrophication, can lead to serious public and environmental health problems such as harmful algal blooms, fish kills, and "dead zones."</p>
                <p>Common sources of nitrogen pollution in surface water include agricultural and urban runoff, and wastewater and sewage discharges. Chemical fertilizers and animal manure containing nitrate are commonly used and applied to crop fields worldwide. Commercial fertilizers containing nitrate and other nutrients are also applied in urban and residential areas. Runoff with excess fertilizer can flow into a nearby waterbody, dump a large amount of nutrients into the water, and accelerate the eutrophication process. Wastewater treatment facilities that do not remove nitrogen can also contribute to high levels of nitrogen in surface and groundwater.</p>
                <h2>How do I interpret the data?</h2>
                <p>The State Water Resources Control Board is considering statewide water quality objectives for <a href='https://www.waterboards.ca.gov/water_issues/programs/biostimulatory_substances_biointegrity/' target='_blank' rel='noreferrer noopener'>nutrients and other biostimulatory substances</a>.</p>
                <p>A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for nitrogen and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p> 
                <h2>References</h2>
                <p><a href='https://www.pca.state.mn.us/sites/default/files/wq-s6-26a2.pdf' target='_blank' rel='noreferrer noopener'>Wall, D. (2013) Nitrogen in Waters: Forms and Concerns. In Wall, D., Nitrogen in Minnesota Surface Waters (A2). Minnesota Department of Agriculture.</a></p>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/nitrogen-and-water" target="_blank" rel="noreferrer noopener">U.S. Geological Survey, Water Science School. 2018. Nitrogen and Water.</a></p>
            </div>
        </LayoutParameter>
    )
}

