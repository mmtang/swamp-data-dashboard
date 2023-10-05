import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';

import { centerImage, closeIcon, expandIcon, fsWindow, wrapper } from './full-screen-image.module.css';

// This component renders a thumbnail image that, when clicked, is expanded full screen
// The imgClass for the thumbnail picture can be passed in from the parent component (can include hover) so to fit in with the style needed for the parent component
export default function FullScreenImage({ image, imgClass, alt }) {
    const [expandImage, setExpandImage] = useState(false);

    const handleParentClick = (e) => {
        setExpandImage(false);
    }

    const handleChildClick = (e) => {
        // Stop the click propagation when the user clicks on the nested image. We want the full size image to close when the user clicks on the div (but not the image)
        e.stopPropagation(); 
    }

    const handleThumbnailClick = () => {
        if (!expandImage) {
            setExpandImage(true);
        }
    }

    if (image) {
        return (
            <React.Fragment>
                <div className={wrapper}>
                    <img
                        src={image}
                        className={imgClass}
                        alt={alt ? alt : null}
                        onClick={handleThumbnailClick}
                    />
                    <span className={expandIcon} onClick={handleThumbnailClick}>
                        <Icon name='expand' size='large' />
                    </span>
                </div>
                
                { expandImage ? 
                    <div className={fsWindow} onClick={handleParentClick}>
                        <img className={centerImage} onClick={handleChildClick} src={image} />
                        <span className={closeIcon}>✕</span>
                    </div>
                : null }
            </React.Fragment>
        )
    } else {
        return null;
    }
}