import React from 'react';
import { IconMinus } from '@tabler/icons';
import { container } from './icon.module.css';


class IconDash extends React.Component {
    render() {
        return (
            <div className={container}><IconMinus size={42} color="#5d5d5d" stroke={2} /></div>
        )
    }
}

export default IconDash;