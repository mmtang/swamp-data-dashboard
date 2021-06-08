import React from 'react';
import { IconArrowNarrowRight } from '@tabler/icons';
import { arrowContainer, arrowUp, cardContainer, cardTitle } from './analyte-card.module.css';

export default function AnalyteCard({ selectedAnalyte }) {

    if (selectedAnalyte) {
        return (
            <React.Fragment>
                <div className={arrowContainer}>
                    <div className={arrowUp}></div>
                </div>
                <div className={cardContainer}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h3 className={cardTitle}>{selectedAnalyte}&nbsp;&nbsp;&nbsp;</h3>
                        <div><IconArrowNarrowRight size={22} /></div>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper.</p>
                </div>
            </React.Fragment>
        )
    }
}