import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Temperature() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'temperature', display: 'Temperature' }}>
            <div>
                <h2>What is Temperature?</h2>
                <p>Water temperature is a measure of the average kinetic energy of water molecules. It refers to how hot or cold water is, and can be expressed using different scales (e.g., Celsius, Fahrenheit). Temperature is an important water quality indicator that directly affects water chemistry and the health of aquatic organisms.</p>
                <h2>Why is it important?</h2>
                <p>Temperature is a key factor that drives many chemical and biological processes in water. The rate of chemical reactions, and the solubility of substances, generally increases with increasing temperature. This can affect the <Link to='/learn/indicators/conductivity'>conductivity</Link> of water, the bioavailability of substances, and the toxicity of pollutants like heavy metals. Temperature also affects the <Link to='/learn/indicators/dissolved-oxygen'>dissolved oxygen</Link> (DO) levels in water. In general, warmer water can hold less DO than colder water. A change in temperature (and therefore a change in DO) can greatly impact the number and type of organisms that a waterbody can support.</p>
                <p>Temperature is also important because it has a direct effect on the aquatic organisms living in a waterbody. Most organisms are adapted to a specific temperature range, and changes in temperature outside of this range can cause stress to an organism (affecting their metabolism and reproduction) or even death. Water temperature also affects the rate of photosynthesis in plants. In general, the rate of photosynthesis increases with increasing temperature - but only up to a certain point. Temperature that is too high can impair photosynthesis function.</p>
                <h2>How do I interpret the data?</h2>
                <p>Statewide water quality objectives for temperature in enclosed bays and estuaries are specified in the <a href="https://www.waterboards.ca.gov/water_issues/programs/ocean/docs/wqplans/thermpln.pdf" target="_blank" rel="noreferrer noopener">Water Quality Control Plan for Control of Temperature in the Coastal and Interstate Waters and Enclosed Bays of California</a> (Thermal Plan).</p> 
                <p>A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for temperature and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p> 
                <h2>References</h2>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/temperature-and-water?" target="_blank" rel="noreferrer noopener">U.S. Geological Survey. 2018. Temperature and Water.</a></p>
            </div>
        </LayoutParameter>
    )
}

