import React from 'react';
import { IconTrendingDown } from '@tabler/icons';
import { container } from './icon.module.css';


class IconDecreasing extends React.Component {
    render() {
        return (
            <div className={container}><IconTrendingDown size={42} color="#5d5d5d" stroke={2} /></div>
        )
    }
}

export default IconDecreasing;