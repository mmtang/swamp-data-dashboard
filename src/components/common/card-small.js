import React from 'react';
import { card, left, right } from './card-small.module.css';

// Component for rendering analyte cards in grid (learn - indicators)
export default function CardSmall({ leftComponent, children }) {
    return (
        <div className={card}>
            <div className={left}>
                {leftComponent}
            </div>
            <div className={right}>
                {children}
            </div>
        </div>
    )
}