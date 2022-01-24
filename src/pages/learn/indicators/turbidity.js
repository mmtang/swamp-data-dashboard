import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Turbidity() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'turbidity', display: 'Turbidity' }}>
            <div>
                <h2>What is Turbidity?</h2>
                <p>Turbidity is a measure of water clarity; specifically, how cloudy (or opaque) water is. Water looks cloudy when there is more material, such as silt, sand, and algae, suspended in the water. These suspended particles scatter light, which gives the water a murky appearance. Turbidity is an important indicator of sediment, erosion, and pollution levels in a waterbody.</p>
                <h2>Why is it important?</h2>
                <p>Turbidity can have a wide range of effects on a waterbody and its inhabitants. For example, high turbidity can increase the <Link to='/learn/indicators/temperature'>temperature</Link> of water because suspended particles absorb more heat. This has a domino effect in reducing the amount of <Link to='/learn/indicators/dissolved-oxygen'>dissolved oxygen</Link> (DO) in water because warm water holds less DO than cold water. Turbidity also affects photosynthesis by reducing the amount of sunlight that can penetrate the water column. Less photosynthesis results in even lower DO levels, which is stressful to aquatic life.</p>
                <p>High turbidity can also have a direct effect on the health of fish and other aquatic organisms living in a waterbody. An increase in suspended particles can degrade habitat, affect reproduction and spawning, and impair vision and gill function. More obviously, turbidity changes the appearance and aesthetic quality of water. Highly turbid waters are less appealing to be around, which can impact recreation and tourism.</p>
                <p>Turbidity can be caused by both natural and human-driven prosses. Some common sources of turbidity include erosion, wastewater discharges, and surface runoff. The amount of turbidity caused by human-driven activities is much greater than that caused by natural processes.  Turbidity often increases sharply during and right after a storm event, when the moving water transports waste and materials from impervious services into the local waterbody.</p>
                <h2>How do I interpret the data?</h2>
                <p>There are no statewide water quality objectives for turbidity. A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for turbidity and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p> 
                <h2>References</h2>
                <p><a href="https://archive.epa.gov/water/archive/web/html/vms55.html" target="_blank" rel="noreferrer noopener">U.S. Environmental Protection Agency. 2012. Turbidity. In Water: Monitoring & Assessment.</a></p>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/turbidity-and-water" target="_blank" rel="noreferrer noopener">U.S. Geological Survey, Water Science School. 2018. Turbidity and Water.</a></p>
            </div>
        </LayoutParameter>
    )
}

