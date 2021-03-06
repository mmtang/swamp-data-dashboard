import React from 'react';
import { Link } from 'gatsby';
import CardSmall from '../../../components/common/card-small';
import LayoutInfo from '../../../components/layout/layout-info';
import ParameterIcon from '../../../components/icons/parameter-icon';
import { analytes } from '../../../constants/constants-data';
import { main } from '../../pages.module.css';
import { grid } from './index.module.css';
import Metadata from '../../../components/layout/metadata';

// This component renders the content of the indicators page and programmatically generates the cards in the indicator grid
export default function ParametersIndex() {
    // List the indicators in alphabetical order: sort ascending by the label property
    const items = Object.values(analytes).sort((a, b) => a['label'].toLowerCase().localeCompare(b['label'].toLowerCase()));

    // Generate the cards to be displayed on the indicator index page
    const cards = items.map(d => {
        if (d.page) {
            return (
                <Link to={d.page} key={d.code}>
                    <CardSmall leftComponent={<ParameterIcon icon={d.code} size={60} />}>
                        <h4>{d.label}</h4>
                        <p>{d.blurb}</p>
                    </CardSmall>
                </Link>
            )
        } else {
            return null;
        }
    });

    return (
        <LayoutInfo active='learn'>
            <Metadata title='Water Quality Indicators' />
            <div className={main}>
                <h1>Water quality indicators</h1>
                <p>SWAMP measures a variety of chemical, physical, and biological parameters to assess the quality of water in rivers, lakes, and other waterbodies throughout California. Each parameter or indicator tells us something different about the condition of the waterbody. Evaluating them together provides a more complete picture of the waterbody's overall health.</p>
                <div className={grid}>
                    { cards }
                </div>
            </div>
        </LayoutInfo>
    )
}

