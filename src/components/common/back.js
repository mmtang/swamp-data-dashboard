import React from 'react';
import { IconArrowLeft } from '@tabler/icons';
import { container } from './back.module.css';

export default function Back({ handleClick }) {
    return (
        <div className={container} onClick={handleClick}>
            <IconArrowLeft size={28} stroke={3} />
            Back
        </div>
    )
}