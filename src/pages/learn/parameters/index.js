import React from 'react';
import LayoutInfo from '../../../components/layout/layout-info';
import Hero from '../../../components/common/hero';
import { Icon } from 'semantic-ui-react';
import { main } from '../../pages.module.css';

export default function ParametersIndex() {
    return (
        <LayoutInfo title="SWAMP Data Dashboard" active="learn">
            <div>
                <Hero>
                    <h1>Water quality parameters</h1>
                </Hero>
                <div className={main}>
                    <h2>Chemical parameters</h2>
                    <p>Chemical properties are a key factor in assessing the health of a waterbody. Chemical parameters include nutrients, suspended solids, pH, and specific conductivity.</p>
                    <h2>Physical paramaters</h2>
                    <p>Scientists monitor the physical properties of water to inform water quality assessments. These parameters include sensory observations such as appearance, color, and temperature.</p>
                    <h2>Biological parameters</h2>
                    <p>The fauna and flora found living in a waterbody can serve as indicators of ecological condition. Commonly used biological indicators include benthic macroinvertebrates (bugs) and algae.</p>
                </div>
            </div>
        </LayoutInfo>
    )
}

