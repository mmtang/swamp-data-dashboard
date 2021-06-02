import React from 'react';
import { trendCard, cardHeader, cardBody, cardTitle, small } from './trend.module.css';


export default function Trend() {
    return (
        <div className={trendCard}>
            <div className={cardHeader}>Trend</div>
            <div className={cardBody}>
                <h6 className={cardTitle}>Increasing</h6>
                <span className={small}>Five-year trend</span>
            </div>
        </div>
    )
}