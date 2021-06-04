import React, { useState } from 'react';
import { IconRipple, IconCirclePlus, IconCircleMinus } from '@tabler/icons';
import { waterbodyCard, leftContainer, cardBody, cardTitle } from './waterbody-card.module.css';

export default function WaterbodyCard({ feature }) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        if (expanded === false) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }

    function ExpandedCard() {
        return (
            <div style={{ marginTop: '0.5em', fontSize: "0.8em"}}>
                { feature.on303dlist === 'Y' ? 'On 303(d) list' : 'Not on 303(d) List' }
                &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                <a href={feature.waterbodyreportlink} target="_blank" rel="noreferrer" rel="noopener">USEPA Report</a>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className={waterbodyCard} role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleClick}>
                <div className={leftContainer}><IconRipple size={30} color="#fff" /></div>
                <div className={cardBody}>
                    <div>
                        <div><span className={cardTitle}>{feature.assessmentunitname}</span></div>
                        { expanded ? <ExpandedCard /> : null }
                    </div>
                    <div>{ expanded ? <IconCircleMinus size={18} color="#5d5d5d" stroke={2} /> : <IconCirclePlus size={18} color="#5d5d5d" stroke={2} /> }</div>
                </div>
            </div>
        </React.Fragment>
    )
}