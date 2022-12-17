import React from 'react';
import LoaderDark from './loader-dark';
import { blockContainer } from './loader-block.module.css';

export default function LoaderBlock() {
    return (
        <div className={blockContainer}>
            <LoaderDark />
        </div>
    )
}