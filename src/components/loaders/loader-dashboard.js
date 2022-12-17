import React from 'react';
import Loader from './loader';
import { fsContainer } from './loader-dashboard.module.css';

export default function LoaderDashboard({ children }) {
    return (
        <div className={fsContainer}>
            <Loader />
        </div>
    )
}