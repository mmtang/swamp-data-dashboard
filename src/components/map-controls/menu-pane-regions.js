import React from 'react';
import { irRegionDict } from '../../utils/utils';
import { card, regionName } from './menu-pane-regions.module.css';

export default function MenuPaneRegions() {   
    const regions = [
        {
            label: irRegionDict['North Coast'],
            color: '#ffb5a6'
        },
        {
            label: irRegionDict['San Francisco Bay'],
            color: '#f7d6a5'
        },
        {
            label: irRegionDict['Central Coast'],
            color: '#87d6ba'
        },
        {
            label: irRegionDict['Los Angeles'],
            color: '#a4a4b5'
        },
        {
            label: irRegionDict['Central Valley'],
            color: '#c6ddf1'
        },
        {
            label: irRegionDict['Lahontan'],
            color: '#ffd464'
        },
        {
            label: irRegionDict['Colorado River'],
            color: '#ff9d6b'
        },
        {
            label: irRegionDict['Santa Ana'],
            color: '#fea5c6'
        },
        {
            label: irRegionDict['San Diego'],
            color: '#58c8d8'
        }
    ]

    return (
        <div>
            { regions.map(d => {
                return (
                    <div className={card} /* style={{ backgroundColor: `${d.color}` }} */ >
                        <div className={regionName}>{d.label}</div>
                    </div>
                )
            }) }
        </div>
    )
}