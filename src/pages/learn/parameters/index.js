import React from 'react';
import { Link } from 'gatsby';
import LayoutInfo from '../../../components/layout/layout-info';
import Hero from '../../../components/common/hero';
import CardSmall from '../../../components/common/card-small';
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
                    <p>SWAMP measures a variety of chemical, physical, and biological properties that affect the quality of water in rivers, lakes, and other waterbodies. Chemical parameters include pH and dissolved oxygen, physical parameters include temperature and turbidity, and biological parameters include indicators such as benthic macroinvertebrates (bugs) and algae. Here are some of the main parameters monitored by SWAMP.</p>
                    <div className={grid}>
                        {/* CSCI */}
                        <Link to="./csci"><CardSmall leftComponent={<ParameterIcon icon='csci' size={60} />}>
                            <h4>California Stream Condition Index</h4>
                            <p>A statewide index for translating complex data about benthic macroinvertebrates (bugs) found living in a stream into an overall measure of stream health.</p>
                        </CardSmall></Link>
                        {/* Conductivity */}
                        <Link to="./conductivity"><CardSmall leftComponent={<ParameterIcon icon='conductivity' size={60} />}>
                            <h4>Conductivity</h4>
                            <p>A measure of the ability of water to pass an electrical current. Significant changes may indicate that a discharge or source of disturbance has decreased the relative condition of the waterbody.</p>
                        </CardSmall></Link>
                        {/* Dissolved Oxygen */}
                        <Link to="./dissolved_oxygen"><CardSmall leftComponent={<ParameterIcon icon='dissolvedOxygen' size={60} />}>
                            <h4>Dissolved Oxygen</h4>
                            <p>The amount of oxygen present in the water. It is a direct indicator of a waterbody's ability to support aquatic life.</p>
                        </CardSmall></Link>
                        {/* E. coli */}
                        <Link to="./ecoli"><CardSmall leftComponent={<ParameterIcon icon='ecoli' size={60} />}>
                            <h4>E. coli</h4>
                            <p>Bacteria found in the environment, food, and the intestines of warm-blooded animals and humans. It is an indicator of sewage or animal waste contamination.</p>
                        </CardSmall></Link>
                        {/* pH */}
                        <Link to="./ph"><CardSmall leftComponent={<ParameterIcon icon='ph' size={60} />}>
                            <h4>pH</h4>
                            <p>A measure of how acidic or basic the water is as determined by measuring the concentration of hydrogen ions. The pH level in a lake or stream is crucial for the survival of aquatic organisms and plants.</p>
                        </CardSmall></Link>
                        {/* Temperature */}
                        <Link to="./temperature"><CardSmall leftComponent={<ParameterIcon icon='temperature' size={60} />}>
                            <h4>Temperature</h4>
                            <p>A measure of the average energy (kinetic) of water molecules. It is an important indicator of the general condition of a waterbody and the ecosystem it supports.</p>
                        </CardSmall></Link>
                        {/* Total Dissolved Solids */}
                        <Link to="./tds"><CardSmall leftComponent={<ParameterIcon icon='tds' size={60} />}>
                            <h4>Total Dissolved Solids</h4>
                            <p>The total concentration of organic and inorganic substances in water. Most dissolved substances do not pose a health threat, but a high level can indicate potential concerns and a need for further investigation.</p>
                        </CardSmall></Link>
                        {/* Total Kjeldahl Nitrogen */}
                        <Link to="./total_kjeldahl_nitrogen"><CardSmall leftComponent={<ParameterIcon icon='tkn' size={60} />}>
                            <h4>Total Kjeldahl Nitrogen</h4>
                            <p>The sum of organic nitrogen, ammonia, and ammonium in a waterbody. High concentrations can indicate sewage manure discharges are present.</p>
                        </CardSmall></Link>
                        {/* Total Nitrogen */}
                        <Link to="./total_nitrogen"><CardSmall leftComponent={<ParameterIcon icon='totalNitrogen' size={60} />}>
                            <h4>Total Nitrogen</h4>
                            <p>An essential plant nutrient (like phosphorus), but too much can lead to an excessive growth of plants and algae in the water, which has adverse ecological effects.</p>
                        </CardSmall></Link>
                        {/* Total Phosphorus */}
                        <Link to="./total_phosphorus"><CardSmall leftComponent={<ParameterIcon icon='totalPhosphorus' size={60} />}>
                            <h4>Total Phosphorus</h4>
                            <p>An essential plant nutrient (like nitrogen), but too much can lead to an excessive growth of plants and algae in the water, which has adverse ecological effects.</p>
                        </CardSmall></Link>
                        {/* Turbidity */}
                        <Link to="./turbidity"><CardSmall leftComponent={<ParameterIcon icon='turbidity' size={60} />}>
                            <h4>Turbidity</h4>
                            <p>A measure of the clarity or cloudiness of water. It is an important indicator of sediment and erosion levels, which can affect ecological productivity and habitat quality.</p>
                        </CardSmall></Link>
                    </div>
                </div>
            </div>
        </LayoutInfo>
    )
}

