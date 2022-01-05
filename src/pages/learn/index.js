import React from 'react';
import { Link } from 'gatsby';
import LayoutInfo from '../../components/layout/layout-info';
import { Icon } from 'semantic-ui-react';
import { main } from '../pages.module.css';
import { linkWrapper, linkHeader } from './index.module.css';

export default function LearnIndex() {
    return (
        <LayoutInfo active="learn">
            <div className={main}>
                <h1>Learn more</h1>
                { /* Wrap links in div to prevent breaking between the text and icon */ }
                <div className={linkWrapper}><h2 className={linkHeader}><Link to="/learn/indicators">Water quality indicators&nbsp;&nbsp;&nbsp;<Icon name='arrow right' /></Link></h2></div>
                <p>SWAMP measures a variety of chemical, physical, and biological indicators to assess the quality of water in rivers, lakes, and other waterbodies. Chemical indicators include pH and dissolved oxygen, physical indicators include temperature and turbidity, and biological indicators include benthic macroinvertebrates and algae.</p>
                <div className={linkWrapper}><h2 className={linkHeader}>Calculating trends&nbsp;&nbsp;&nbsp;<Icon name='arrow right' /></h2></div>
                <p>The SWAMP Data Dashboard uses historical data to analyze trends in water quality at each monitoring site over time. Studying long-term trends can tell us if water quality is improving or degrading in response to management actions and changes in land use and climate change. Learn more about how we calculate and categorize trends.</p>
            </div>
        </LayoutInfo>
    )
}

