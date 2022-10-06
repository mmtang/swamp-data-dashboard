import React from 'react';

import { matrixColor } from '../../constants/constants-app';

import { tagBox, tagWrapper } from './matrix-tag.module.css';

export default function MatrixTag({ matrix, height }) {
    const sedimentColor = matrixColor['sediment'];
    const waterColor = matrixColor['samplewater'];
    const otherColor = '#0f4c5c';

    const tagColor = (matrix) => {
        switch (matrix) {
            case 'samplewater':
                return waterColor;
                break;
            case 'sediment':
                return sedimentColor;
                break;
            default:
                return otherColor;
        }
    }

    return (
        <div className={tagWrapper}>
            <div className={tagBox} style={{ backgroundColor: `${tagColor(matrix)}`, height: `${height ? height + 'px' : '19px' }` }}>
                {matrix}
            </div>
        </div>
    )
}