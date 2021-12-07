import React from 'react';
import { Link } from 'gatsby';
import LayoutInfo from '../../../components/layout/layout-info';
import Hero from '../../../components/common/hero';
import CardSmall from '../../../components/common/card-small';
import ParameterIcon from '../../../components/icons/parameter-icon';
import { analytes } from '../../../utils/constants';
import { main } from '../../pages.module.css';
import { grid } from './index.module.css';

export default function ParametersIndex() {
    // Sort ascending by the label property of the analyte dictionary items
    const items = Object.values(analytes).sort((a, b) => a['label'].toLowerCase().localeCompare(b['label'].toLowerCase()));
    // Build the cards
    const cards = items.map(d => <Link to={d.page}><CardSmall leftComponent={<ParameterIcon icon={d.code} size={60} key={d.code} />}><h4>{d.label}</h4><p>{d.blurb}</p></CardSmall></Link>);

    return (
        <LayoutInfo>
            <div>
                <Hero>
                    <h1>Water quality indicators</h1>
                </Hero>
                <div className={main}>
                    <p>SWAMP measures a variety of chemical, physical, and biological indicators to assess the quality of water in rivers, lakes, and other waterbodies. Chemical indicators include pH and dissolved oxygen, physical indicators include temperature and turbidity, and biological indicators include benthic macroinvertebrates (bugs) and algae.</p>
                    <div className={grid}>
                        { cards }
                    </div>
                </div>
            </div>
        </LayoutInfo>
    )
}

