import React from 'react';
import { container, hero, content } from './hero.module.css';

export default function Hero({ children }) {
    return (
        <div className={container}>
            <div className={hero}>
                <div className={content}>
                    {children}
                </div>
            </div>
        </div>
    )
}