import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Turbidity() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'turbidity', display: 'Turbidity' }}>
            <div>
                <h2>What is Turbidity?</h2>
                <p>Turbidity is a measure of water clarity; specifically, how cloudy (or opaque) the water is. Water looks cloudy when there is more material, such as silt, sand, algae, and plankton, suspended in the water. These suspended particles scatter light, which gives the water a murky appearance. Sources of turbidity include:
                    <ul>
                        <li>Soil erosion</li>
                        <li>Waste discharge</li>
                        <li>Urban runoff</li>
                        <li>Eroding stream banks</li>
                        <li>Large numbers of bottom feeders (such as carp), which stir up bottom sediments</li>
                        <li>Excessive algal growth.</li>
                    </ul>
                </p>
                <h2>Why is it important to measure Turbidity?</h2>
                <p>Higher turbidity increases water temperatures because suspended particles absorb more heat. This, in turn, reduces the concentration of dissolved oxygen (DO) because warm water holds less DO than cold. Higher turbidity also reduces the amount of light penetrating the water, which reduces photosynthesis and the production of DO. Suspended materials can clog fish gills, reducing resistance to disease in fish, lowering growth rates, and affecting egg and larval development. As the particles settle, they can blanket the stream bottom, especially in slower waters, and smother fish eggs and benthic macroinvertebrates.</p>
                <p>Turbidity can be useful as an indicator of the effects of runoff from construction, agricultural practices, logging activity, discharges, and other sources. Turbidity often increases sharply during a rainfall, especially in developed watersheds, which typically have relatively high proportions of impervious surfaces. Regular monitoring of turbidity can help detect trends that might indicate increasing erosion in developing watersheds.</p>
            </div>
        </LayoutParameter>
    )
}

