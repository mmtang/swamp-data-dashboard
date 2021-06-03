import React from 'react';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { trendCard, iconContainer, cardBody, cardTitle, small } from './trend.module.css';


export default function Trend({ trend, yearRange }) {
    console.log(yearRange);
    const numberOfYears = yearRange[1] - yearRange[0];
    console.log(numberOfYears);

    return (
        <div className={trendCard}>
            <div className={iconContainer}>{ trend.trend === 'Increasing' ? <IconTrendingUp size={42} color="#5d5d5d" stroke={2} /> : trend.trend === 'Decreasing' ? <IconTrendingDown size={42} color="#5d5d5d" stroke={2} /> : <IconMinus size={42} color="#5d5d5d" stroke={2} /> }</div>
            <div className={cardBody}>
                <div>
                    <h6 className={cardTitle}>{trend.trend}</h6>
                    <span className={small}>{numberOfYears}-year trend</span>
                </div>
            </div>
        </div>
    )
}