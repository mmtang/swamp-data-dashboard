import React from 'react';
import { IconMapPin } from '@tabler/icons';
import { regionDict } from '../../utils/utils';
import { card, leftContainer, cardBody, cardTitle, station } from './card.module.css';

export default function CardStation({ feature }) {

    return (
        <React.Fragment>
            <a href={'./?q=' + feature.StationCode} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                <div className={card} role="button" tabIndex={0}>
                    <div className={`${leftContainer} ${station}`}><IconMapPin size={30} color="#fff" /></div>
                    <div className={cardBody}>
                        <div>
                            <div><span className={cardTitle}>{feature.StationName}</span></div>
                            <div style={{ marginTop: '0.5em', fontSize: "0.8em"}}>
                                {feature.StationCode}
                                &nbsp;&nbsp;&#9679;&nbsp;&nbsp;
                                {regionDict[feature.Region]} Region
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </React.Fragment>
    )
}