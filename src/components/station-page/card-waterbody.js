import React from 'react';
import { IconRipple } from '@tabler/icons';
// Import styles
import { 
    card, 
    cardBody, 
    cardTitle, 
    leftContainer, 
    listingWrapper,
    smallText, 
    waterbody
} from './card-waterbody.module.css';

export default function CardWaterbody({ feature }) {

    return (
        <React.Fragment>
            <div className={card}>
                <div className={`${leftContainer} ${waterbody}`}><IconRipple size={30} color="#fff" /></div>
                <div className={cardBody}>
                    <div>
                        <div className={cardTitle}>{feature.wbname}</div>
                        <div className={listingWrapper}>
                            {feature.wb_listingstatus}
                            &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                            <a href={feature.fact_sheet} target="_blank" rel="noopener noreferrer">Fact sheet</a>
                        </div>
                        { feature.wb_listingstatus === 'Listed' ? <div className={smallText}>Listed pollutants: {feature.listed_pollutants}</div> : null }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}