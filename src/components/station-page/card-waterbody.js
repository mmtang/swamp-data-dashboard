import React from 'react';
import { IconRipple } from '@tabler/icons';
// Import styles
import { 
    card, 
    cardBody, 
    cardTitle, 
    leftContainer, 
    listingList,
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
                        <div className={cardTitle}>{feature.waterbodyname}</div>
                        <div className={listingWrapper}>
                            {`${feature.listingstatus} (Category ${feature.integratedreportcategory})`}
                            &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                            <a href={feature.hyperlink} target="_blank" rel="noopener noreferrer">Fact sheet</a>
                        </div>
                        { feature.listingstatus === 'Listed' ? 
                            <div>
                                <ul className={listingList}>
                                    <li className={smallText}>New Pollutant Listed: {feature.newpollutantlisted}</li>
                                    <li className={smallText}>New Pollutants DeListed: {feature.newpollutantsdelisted}</li> 
                                    <li className={smallText}>Past Cycle Listings: {feature.pastcyclelistings}</li> 
                                </ul>
                            </div>
                            : null 
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}