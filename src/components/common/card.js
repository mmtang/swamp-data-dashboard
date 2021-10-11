import React from 'react';
import { Link } from 'gatsby';
import { parent, imageCard, imageContainer, contentContainer, textContainer } from './card.module.css';

export default function Card({ imagePath, imageAlt, link, children }) {
    if (link) {
        return (
            <div className={parent}>
                <Link to={link}>
                    <div className={contentContainer}>
                        <div className={imageContainer}>
                            <img className={imageCard} src={imagePath} alt={imageAlt} />
                        </div>
                        <div className={textContainer}>
                            {children}
                        </div>
                    </div>
                </Link>
            </div>
        )
    } else {
        return (
            <div className={parent}>
                <div className={contentContainer}>
                    <div className={imageContainer}>
                        <img className={imageCard} src={imagePath} alt={imageAlt} />
                    </div>
                    <div className={textContainer}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}