import React from 'react';
import { card, left, right } from './small-card.module.css';

export default function SmallCard({ leftComponent, children }) {
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