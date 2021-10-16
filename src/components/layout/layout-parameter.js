import React from 'react';
import LayoutInfo from './layout-info';
import Hero from '../common/hero';
import ParameterIcon from '../icons/parameter-icon';
import ParameterMenu from '../learn/parameter-menu';
import { main } from '../../pages/pages.module.css';
import { parent, textContainer, menuContainer } from './layout-parameter.module.css';


function LayoutParameter({ parameter, children }) {    
    return (
        <LayoutInfo title='SWAMP Data Dashboard'>
            <Hero>
                <h1>Turbidity</h1>
            </Hero>
            <div className={main}>
                <div className={parent}>
                    <div>
                        <ParameterIcon icon={parameter} size={60} />
                    </div>
                    <div className={textContainer}>
                        {children}
                    </div>
                    <div className={menuContainer}>
                        <ParameterMenu activeParameter={parameter} />
                    </div>
                </div>
            </div>
        </LayoutInfo>
    )
}

export default LayoutParameter;