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
                        <div><span className={cardTitle}>{feature.wbname}</span></div>
                        <div style={{ marginTop: '0.5em', fontSize: "0.8em"}}>
                            {feature.wb_listingstatus}
                            &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                            <a href={feature.fact_sheet} target="_blank" rel="noopener noreferrer">Fact Sheet</a>
                        </div>
                        { feature.wb_listingstatus === 'Listed' ? <div style={{ marginTop: '0.25em', fontSize: "0.8em"}}>Listed pollutants: {feature.listed_pollutants}</div> : null }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}