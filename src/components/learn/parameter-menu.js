import React from 'react';
import { Link } from 'gatsby';
import { container, menu, title, item, active } from './parameter-menu.module.css';


const ParameterMenu = ({ activeParameter }) => {

    return (
        <div className={container}>
            <nav aria-label='Parameter navigation'>
                <ul className={menu}>
                    <div className={title}>Parameters</div>
                    {/* CSCI */}
                    <Link to='/learn/parameters/csci'><li className={activeParameter === 'csci' ? `${item} ${active}` : `${item}`}>
                        California Stream Condition Index
                    </li></Link>
                    {/* Conductivity */}
                    <Link to='/learn/parameters/conductivity'><li className={activeParameter === 'conductivity' ? `${item} ${active}` : `${item}`}>
                        Conductivity
                    </li></Link>
                    {/* Dissolved Oxygen */}
                    <Link to='/learn/parameters/dissolved_oxygen'><li className={activeParameter === 'dissolvedOxygen' ? `${item} ${active}` : `${item}`}>
                        Dissolved Oxygen
                    </li></Link>
                    {/* E. coli */}
                    <Link to='/learn/parameters/ecoli'><li className={activeParameter === 'ecoli' ? `${item} ${active}` : `${item}`}>
                        E. coli
                    </li></Link>
                    {/* pH */}
                    <Link to='/learn/parameters/ph'><li className={activeParameter === 'ph' ? `${item} ${active}` : `${item}`}>
                        pH
                    </li></Link>
                    {/* Temperature */}
                    <Link to='/learn/parameters/temperature'><li className={activeParameter === 'temperature' ? `${item} ${active}` : `${item}`}>
                        Temperature
                    </li></Link>
                    {/* Total Dissolved Solids */}
                    <Link to='/learn/parameters/tds'><li className={activeParameter === 'tds' ? `${item} ${active}` : `${item}`}>
                        Total Dissolved Solids
                    </li></Link>
                    {/* Total Kjeldahl Nitrogen */}
                    <Link to='/learn/parameters/total_nitrogen'><li className={activeParameter === 'tkn' ? `${item} ${active}` : `${item}`}>
                        Total Kjeldahl Nitrogen
                    </li></Link>
                    {/* Total Nitrogen */}
                    <Link to='/learn/parameters/total_nitrogen'><li className={activeParameter === 'totalNitrogen' ? `${item} ${active}` : `${item}`}>
                        Total Nitrogen
                    </li></Link>
                    {/* Total Phosphorus */}
                    <Link to='/learn/parameters/total_phosphorus'><li className={activeParameter === 'totalPhosphorus' ? `${item} ${active}` : `${item}`}>
                        Total Phosphorus
                    </li></Link>
                    {/* Turbidity */}
                    <Link to='/learn/parameters/turbidity'><li className={activeParameter === 'turbidity' ? `${item} ${active}` : `${item}`}>
                        Turbidity
                    </li></Link>
                </ul>
            </nav>
        </div>
    )

}

export default ParameterMenu;