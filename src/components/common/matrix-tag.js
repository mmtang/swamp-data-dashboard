import React from 'react';

import { matrixColor } from '../../constants/constants-app';

import { tagBox, tagWrapper } from './matrix-tag.module.css';

export default function MatrixTag({ matrix }) {
    const sedimentColor = matrixColor['sediment'];
    const waterColor = matrixColor['samplewater'];

    console.log(matrix);

    const tagColor = () => {
        if (matrix === 'sediment') {
            return sedimentColor;
        } else if (matrix === 'samplewater') {
            return waterColor;
        }
    }

    return (
        <div className={tagWrapper}>
            <div className={tagBox} style={{ backgroundColor: `${tagColor()}` }}>
                {matrix}
            </div>
        </div>
    )
}