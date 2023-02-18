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
                        <div className={cardTitle}>{feature.waterbody_name}</div>
                        <div className={listingWrapper}>
                            {feature.listing_status}
                            &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                            <a href={feature.fact_sheet} target="_blank" rel="noopener noreferrer">Fact sheet</a>
                        </div>
                        { feature.listing_status === 'Listed' ? <div className={smallText}>Pollutants listed: {feature.pollutants_listed}</div> : null }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}