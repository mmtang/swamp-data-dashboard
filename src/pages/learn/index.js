import React from 'react';
import LayoutInfo from '../../components/layout/layout-info';
import Hero from '../../components/common/hero';
import Footer from '../../components/layout/footer';
import { Icon } from 'semantic-ui-react';
import { main } from '../pages.module.css';

export default function LearnIndex() {
    return (
        <LayoutInfo title="SWAMP Data Dashboard" active="learn">
            <div>
                <Hero>
                    <h1>Learn</h1>
                </Hero>
                <div className={main}>
                    <h2>Water quality parameters&nbsp;&nbsp;&nbsp;<Icon name='arrow right' /></h2>
                    <p>SWAMP measures the chemical, physical, and biological properties that affect the quality of water in rivers, streams, lakes, and other waterbodies. Chemical properties include pH and dissolved oxygen, physical properties include temperature and turbidity, and biological properties include indicators such as bugs (benthic macroinvertebrates) and algae. Learn more about these parameters and why they are important for asessing the condition of our waters.</p>
                    <h2>Calculating trends&nbsp;&nbsp;&nbsp;<Icon name='arrow right' /></h2>
                    <p>The SWAMP Data Dashboard uses historical data to analyze trends in water quality at each monitoring site over time. Studying long-term trends can tell us if water quality is improving or degrading in response to management actions and changes in land use and climate change. Learn more about how we calculate and categorize trends.</p>
                </div>
            </div>
        </LayoutInfo>
    )
}

