import React from 'react';
import { arrowContainer, arrowUp, cardContainer, cardTitle } from './card.module.css';

export default function AnalyteCard({ selectedAnalyte }) {

    if (selectedAnalyte) {
        return (
            <React.Fragment>
                <div className={arrowContainer}>
                    <div className={arrowUp}></div>
                </div>
                <div className={cardContainer}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h3 className={cardTitle}>{selectedAnalyte}</h3>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper.</p>
                </div>
            </React.Fragment>
        )
    }
}