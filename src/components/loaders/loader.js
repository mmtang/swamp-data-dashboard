import React from 'react';
import { container, loader, loadText } from './loader.module.css';

export default function Loader() {
    return (
        <div className={container}>
            <div className={loader}></div>
            <div className={loadText}>Loading</div>
        </div>
    )
}