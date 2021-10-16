import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Turbidity() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter="turbidity">
            <div>
                <h2>What is Turbidity?</h2>
                <p>Turbidity is a measure of cloudiness in water. Cloudiness is caused by the amount of particulates, such as silt, sand, and mud, that are suspended or dissolved in water. These particulates absorb and scatter light, creating a murky or opaque appearance. </p>
                <h2>Why is it important to measure Turbidity?</h2>
                <p>Turbidity is a physical parameter and an important indicator of water quality. High turbidity reduces how much sunlight penetrates the water and blocks photosynthesis, which has important implications on ecosystem health and productivity. While turbidity does occur naturally, sharp increases in the amount of particulate matter present can indicate potential pollution from human-induced sources. It not only harms fish and other aquatic life but also reduces the aesthetic quality and recreational use of lakes and streams.</p>

            </div>
        </LayoutParameter>
    )
}

