import React from 'react';
import { Link } from 'gatsby';
import { container, menu, title, item, active } from './parameter-menu.module.css';


const ParameterMenu = ({ activeParameter }) => {

    return (
        <div className={container}>
            <nav aria-label='Parameter navigation'>
                <ul className={menu}>
                    <div className={title}>Parameters</div>
                    <li className={item}>
                        California Stream Condition Index
                    </li>
                    <li className={item}>
                        Temperature
                    </li>
                    <Link to='/learn/parameters/turbidity'><li className={activeParameter === 'turbidity' ? `${item} ${active}` : `${item}`}>
                        Turbidity
                    </li></Link>
                </ul>
            </nav>
        </div>
    )

}

export default ParameterMenu;