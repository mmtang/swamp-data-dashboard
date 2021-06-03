import React from 'react';
import IconIncreasing from '../common/icon-increasing';
import IconDecreasing from '../common/icon-decreasing';
import IconDash from '../common/icon-dash';
import { trendCard, iconContainer, cardBody, cardTitle, small } from './trend.module.css';


export default function Trend({ trend }) {
    return (
        <div className={trendCard}>
            <div className={iconContainer}>{ trend.trend === 'Increasing' ? <IconIncreasing /> : trend.trend === 'Decreasing' ? <IconDecreasing /> : <IconDash /> }</div>
            <div className={cardBody}>
                <div>
                    <h6 className={cardTitle}>{trend.trend}</h6>
                    <span className={small}>Five-year trend</span>
                </div>
            </div>
        </div>
    )
}