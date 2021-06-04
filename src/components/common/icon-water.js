import React from 'react';
import { IconRipple } from '@tabler/icons';
import { container } from './icon.module.css';


class IconWater extends React.Component {
    render() {
        return (
            <div className={container} style={{ backgroundColor: '#247ba0' }}><IconRipple size={24} color="#fff" /></div>
        )
    }
}

export default IconWater;