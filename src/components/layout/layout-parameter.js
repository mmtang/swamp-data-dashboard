import React from 'react';
import LayoutInfo from './layout-info';
import ParameterIcon from '../icons/parameter-icon';
import ParameterMenu from '../learn/parameter-menu';
import { main } from '../../pages/pages.module.css';
import { menuContainer, parent, textContainer } from './layout-parameter.module.css';

// No longer in use 0.2.0; kept here for reference, may be reused in the future
function LayoutParameter({ parameter, children }) {    
    return (
        <LayoutInfo active='learn'>
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