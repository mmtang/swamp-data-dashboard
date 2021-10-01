import React, { Children } from 'react';
import { parent, imageCard, imageContainer, contentContainer } from './card.module.css';

export default function Card({ imagePath, imageAlt, children }) {
    return (
        <div className={parent}>
            <div className={imageContainer}>
                <img className={imageCard} src={imagePath} alt={imageAlt} />
            </div>
            <div className={contentContainer}>
                {children}
            </div>
        </div>
    )
}