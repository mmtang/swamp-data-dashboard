import React from 'react';
import { IconTrendingUp } from '@tabler/icons';
import { container } from './icon.module.css';


class IconIncreasing extends React.Component {
    render() {
        return (
            <div className={container}><IconTrendingUp size={42} color="#5d5d5d" stroke={2} /></div>
        )
    }
}

export default IconIncreasing;