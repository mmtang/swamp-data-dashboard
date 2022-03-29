import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';
import Metadata from '../../../components/layout/metadata';

export default function DissolvedOxygen() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'dissolvedOxygen', display: 'Dissolved Oxygen' }}>
            <Metadata title='Dissolved Oxygen' />
            <div>
                <h2>What is Dissolved Oxygen?</h2>
                <p>Dissolved oxygen (DO) is the amount of oxygen in water that is available to aquatic organisms. This form of oxygen is free oxygen (i.e., not bonded to any other element) and is essential for the survival of fish and other aquatic organisms. The major sources of DO in water include the direct absorption of oxygen from the atmosphere, aeration, and photosynthesis. DO is an important indicator of the overall health of a waterbody and its ability to support aquatic life.</p>
                <h2>Why is it important?</h2>
                {/*
                <p>The amount of DO in waterbody is affected by many natural and human factors. In general, colder water can hold more DO than warmer water. This creates a seasonal cycle, where higher DO levels are often observed in the winter and early spring, and lower DO levels are often observed in the summer and fall. The morphology of a stream and its flow regime also affect DO levels. Fast-moving water where there is a lot of turbulence (e.g., water flowing over boulders or waterfalls) results in more oxygen being absorbed from the surrounding air. In contrast, stagnant or slow-moving bodies of water absorb less oxygen and have lower levels of DO.</p>
                */}
                <p>The amount of DO in a waterbody is of great interest to scientists and water resource managers because even small changes in DO can have direct and indirect effects on the organisms living in the waterbody. If more oxygen is consumed than produced, fish and other sensitive organisms may move away or die. Extreme conditions like hypoxia (low oxygen) or apoxia (no oxygen) can create "dead zones" in which many aquatic organisms suffocate and die. Low DO levels are a common cause of fish kills, which is a massive die-off of fish in an area.</p>
                <p>Hypoxia and apoxia are symptoms of eutrophication, which describes a situation in which an excess of nutrients, such as nitrogen and phosphorus, enters a waterbody. A common source of these nutrients is runoff from agricultural and urban areas, where fertilizers are used. The introduction of a large amount of nutrients into a waterbody can spur a rapid growth in algae and bacteria, which consume the DO in water. As these large masses of algae (often called blooms) continue to grow, DO can become depleted to a level at which fish and other aquatic life cannot survive. Algal blooms also limit the amount of light that penetrates the water surface, which reduces growth and can cause a die-off of plants.</p>
                <p>Natural eutrophication is a slow process that occurs over a long period of time. Human activities have accelerated the rate and extent of eutrophication in many freshwater and coastal ecosystems around the world. Monitoring DO levels can help water resource managers identify when and where eutrophication may be occurring so that strategies can be employed to protect water quality.</p>
                <h2>How do I interpret the data?</h2>
                <p>There are no statewide water quality objectives for DO. A Regional Water Quality Control Board (Regional Water Board) may have region, waterbody, or site-specific water quality objectives for DO and other parameters. These objectives are outlined in each Regional Water Board's Water Quality Control Plan (Basin Plan).</p> 
                <p>In general, minimum concentrations of 5-8 mg/L (depending on water temperature, habitat type, and other factors) are frequently used as objectives to protect the beneficial uses of a waterbody. Higher concentrations are used where there are more sensitive species and/or fish spawning in the water. DO levels below 5 mg/L create a stressful environment for most fish, and levels below 3 mg/L cannot support fish life.</p>
                <h2>References</h2>
                <p><a href="hhttps://www.nature.com/scitable/knowledge/library/eutrophication-causes-consequences-and-controls-in-aquatic-102364466/" target="_blank" rel="noreferrer noopener">Chislock, M. F., Doster, E., Zitomer, R. A. & Wilson, A. E. (2013) Eutrophication: Causes, Consequences, and Controls in Aquatic Ecosystems. Nature Education Knowledge 4(4):10</a></p>
                <p><a href="https://www.waterboards.ca.gov/sanfranciscobay/water_issues/programs/planningtmdls/basinplan/web/bp_ch3.html" target="_blank" rel="noreferrer noopener">San Francisco Bay Regional Water Quality Control Board. 2017. Water Quality Control Plan (Basin Plan) for the San Francisco Bay Basin: Water Quality Objectives.</a></p>
                <p><a href="https://www.usgs.gov/special-topics/water-science-school/science/dissolved-oxygen-and-water" target="_blank" rel="noreferrer noopener">U.S. Geological Survey. 2018. Dissolved Oxygen and Water.</a></p>
            </div>
        </LayoutParameter>
    )
}

