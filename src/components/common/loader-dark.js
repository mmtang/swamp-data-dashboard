import React from 'react';
import { container, loader, loadText } from './loader-dark.module.css';

export default function LoaderDark() {
    return (
        <div className={container}>
            <div className={loader}></div>
            <div className={loadText}>Loading</div>
        </div>
    )
}