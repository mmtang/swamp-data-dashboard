import React from 'react';
import { IconX } from '@tabler/icons';
import { tag, tagText } from './clear-filter.module.css';

export default function ClearFilter({ clearFunction }) {   
    const handleClick = () => {
        clearFunction(null);
    }

    return (
        <div className={tag} role="button" tabIndex={0} onClick={handleClick}>
            <span className={tagText}>Clear</span>
            &nbsp;<IconX size={16} color="#fff" stroke={1} />
        </div>
    )
}