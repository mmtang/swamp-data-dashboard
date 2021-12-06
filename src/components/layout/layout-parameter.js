import React from 'react';
import LayoutInfo from './layout-info';
import Hero from '../common/hero';
import ParameterIcon from '../icons/parameter-icon';
import ParameterMenu from '../learn/parameter-menu';
import { main } from '../../pages/pages.module.css';
import { parent, textContainer, menuContainer } from './layout-parameter.module.css';


function LayoutParameter({ parameter, children }) {    
    return (
        <LayoutInfo>
            <Hero>
                <h1>{parameter.display}</h1>
            </Hero>
            <div className={main}>
                <div className={parent}>
                    <div>
                        <ParameterIcon icon={parameter.name} size={60} />
                    </div>
                    <div className={textContainer}>
                        {children}
                    </div>
                    <div className={menuContainer}>
                        <ParameterMenu activeParameter={parameter.name} />
                    </div>
                </div>
            </div>
        </LayoutInfo>
    )
}

export default LayoutParameter;