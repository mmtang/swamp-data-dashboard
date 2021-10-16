import React from 'react';
import { Link } from 'gatsby';
import LayoutInfo from '../../../components/layout/layout-info';
import Hero from '../../../components/common/hero';
import SmallCard from '../../../components/common/small-card';
import ParameterIcon from '../../../components/icons/parameter-icon';
import { main } from '../../pages.module.css';
import { grid } from './index.module.css';

export default function ParametersIndex() {
    return (
        <LayoutInfo title="SWAMP Data Dashboard">
            <div>
                <Hero>
                    <h1>Water quality parameters</h1>
                </Hero>
                <div className={main}>
                    <p>SWAMP measures a variety of chemical, physical, and biological properties that affect the quality of water in rivers, lakes, and other waterbodies. Chemical parameters include pH and dissolved oxygen, physical parameters include temperature and turbidity, and biological parameters include indicators such as benthic macroinvertebrates (bugs) and algae.</p>
                    <div className={grid}>
                        <SmallCard leftComponent={<ParameterIcon icon='csci' size={60} />}>
                            <h4>California Stream Condition Index</h4>
                            <p>A statewide index for translating complex data about benthic macroinvertebrates (bugs) found living in a stream into an overall measure of stream health.</p>
                        </SmallCard>
                        <SmallCard leftComponent={<ParameterIcon icon='temperature' size={60} />}>
                            <h4>Temperature</h4>
                            <p>A measure of the average energy (kinetic) of water molecules. It is an important indicator of the general condition of a waterbody and the ecosystem it supports.</p>
                        </SmallCard>
                        <Link to="./turbidity"><SmallCard leftComponent={<ParameterIcon icon='turbidity' size={60} />}>
                            <h4>Turbidity</h4>
                            <p>A measure of the clarity or cloudiness of water. It is an important indicator of sediment and erosion levels, which can affect ecological productivity and habitat quality.</p>
                        </SmallCard></Link>
                    </div>
                </div>
            </div>
        </LayoutInfo>
    )
}

