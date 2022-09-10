import React from 'react';
import { withPrefix } from 'gatsby';
import { Icon } from 'semantic-ui-react';

import { button } from './button-station-page.module.css';

export default function ButtonStationPage({ stationCode }) {   
    return (
        <div>
            <a href={withPrefix('/stations/?id=' + encodeURIComponent(stationCode))} target="_blank" rel="noopener noreferrer" className={button}>
                Explore all data&nbsp;&nbsp;&nbsp;<Icon name='external alternate' />
            </a>
        </div>
    )
}