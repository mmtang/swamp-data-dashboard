import React from 'react';
import { IconRipple } from '@tabler/icons';
import { card, leftContainer, cardBody, cardTitle, waterbody } from './card.module.css';

export default function CardWaterbody({ feature }) {

    return (
        <React.Fragment>
            <div className={card}>
                <div className={`${leftContainer} ${waterbody}`}><IconRipple size={30} color="#fff" /></div>
                <div className={cardBody}>
                    <div>
                        <div><span className={cardTitle}>{feature.assessmentunitname}</span></div>
                        <div style={{ marginTop: '0.5em', fontSize: "0.8em"}}>
                            { feature.on303dlist === 'Y' ? 'On 303(d) list' : 'Not on 303(d) List' }
                            &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                            <a href={feature.waterbodyreportlink} target="_blank" rel="noopener noreferrer">USEPA Report</a>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}