import React from 'react';
import { matrixColor } from '../../constants/constants-app';
import { tagBox, tagWrapper } from './matrix-tag.module.css';

export default function MatrixTag({ matrix, height }) {
    const sedimentColor = matrixColor['sediment'];
    const tissueColor = matrixColor['tissue'];
    const waterColor = matrixColor['samplewater'];
    const otherColor = matrixColor['other'];

    const tagColor = (matrix) => {
        switch (matrix) {
            case 'samplewater':
                return waterColor;
                break;
            case 'sediment':
                return sedimentColor;
                break;
            case 'tissue':
                return tissueColor;
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