import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';
import Metadata from '../../../components/layout/metadata';

export default function Tds() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'tds', display: 'Total Dissolved Solids' }}>
            <Metadata title='Total Dissolved Solids' />
            <div>
                <h2>What is Total Dissolved Solids?</h2>
                <p>Total dissolved solids (TDS) is the total concentration of all organic and inorganic substances, including minerals, salts, and metals, in water. These substances mostly consist of calcium, magnesium, sulfur, and other materials that are small enough to pass through a 2-micron (0.002 cm) filter. TDS is closely related to <Link to='../conductivity'>conductivity</Link>, salinity, alkalinity, and hardness measures.</p>
                <h2>Why is it important?</h2>
                <p>TDS is widely used as a general indicator of water quality. High levels of dissolved solids can change the appearance and taste of water, making it unsuitable for drinking and other uses. Most dissolved solids are not harmful, but elevated levels can indicate the presence of other pollutants, such as arsenic, uranium, and radium, that may be harmful to aquatic life. High TDS, or sudden changes in TDS, can signal the need to test for a broader range of constituents that might pose a direct risk to public health and/or the environment.</p>
                <p>TDS has a number of different sources, both natural and human-driven. Rock weathering is a natural process that can increase the concentration of dissolved solids at a regional or local scale. Some sedimentary rocks, such as shales and carbonate rocks, are easily weathered and release more substances into the environment. Human-driven sources of dissolved solids include irrigation, runoff (agricultural and urban), and wastewater discharges. Widely-used commercial products such as detergents, water softeners, fertilizers, and road salt all contain elevated concentrations of dissolved solids that can enter groundwater and/or surface water.</p>
                <h2>How do I interpret the data?</h2>
                <p>There are no statewide water quality objectives for TDS. A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for TDS and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p> 
                <h2>References</h2>
                <p><a href="https://www.usgs.gov/mission-areas/water-resources/science/chloride-salinity-and-dissolved-solids" target="_blank" rel="noreferrer noopener">U.S. Geological Survey. 2019. Chloride, Salinity, and Dissolved Solids.</a></p>
            </div>
        </LayoutParameter>
    )
}

