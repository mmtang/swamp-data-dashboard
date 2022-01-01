import React from 'react';
import { fsContainer, container, loadText } from './loader-dashboard.module.css';

export default function ErrorFullscreen({ children }) {
    return (
        <div className={fsContainer}>
            <div className={container}>
                <div className={loadText}>There has been an error.<br />Try reloading the page or try again later.</div>
            </div>
        </div>
    )
}