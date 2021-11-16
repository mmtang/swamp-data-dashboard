import React from 'react';
import { Link } from 'gatsby';
import { container, menu, title, item, active } from './parameter-menu.module.css';


const ParameterMenu = ({ activeParameter }) => {

    return (
        <div className={container}>
            <nav aria-label='Indicator pages navigation'>
                <ul className={menu}>
                    <div className={title}>Indicators</div>
                    {/* CSCI */}
                    <Link to='/learn/indicators/csci'><li className={activeParameter === 'csci' ? `${item} ${active}` : `${item}`}>
                        California Stream Condition Index
                    </li></Link>
                    {/* Conductivity */}
                    <Link to='/learn/indicators/conductivity'><li className={activeParameter === 'conductivity' ? `${item} ${active}` : `${item}`}>
                        Conductivity
                    </li></Link>
                    {/* Dissolved Oxygen */}
                    <Link to='/learn/indicators/dissolved_oxygen'><li className={activeParameter === 'dissolvedOxygen' ? `${item} ${active}` : `${item}`}>
                        Dissolved Oxygen
                    </li></Link>
                    {/* E. coli */}
                    <Link to='/learn/indicators/ecoli'><li className={activeParameter === 'ecoli' ? `${item} ${active}` : `${item}`}>
                        E. coli
                    </li></Link>
                    {/* pH */}
                    <Link to='/learn/indicators/ph'><li className={activeParameter === 'ph' ? `${item} ${active}` : `${item}`}>
                        pH
                    </li></Link>
                    {/* Temperature */}
                    <Link to='/learn/indicators/temperature'><li className={activeParameter === 'temperature' ? `${item} ${active}` : `${item}`}>
                        Temperature
                    </li></Link>
                    {/* Total Dissolved Solids */}
                    <Link to='/learn/indicators/tds'><li className={activeParameter === 'tds' ? `${item} ${active}` : `${item}`}>
                        Total Dissolved Solids
                    </li></Link>
                    {/* Total Kjeldahl Nitrogen */}
                    <Link to='/learn/indicators/total_nitrogen'><li className={activeParameter === 'tkn' ? `${item} ${active}` : `${item}`}>
                        Total Kjeldahl Nitrogen
                    </li></Link>
                    {/* Total Nitrogen */}
                    <Link to='/learn/indicators/total_nitrogen'><li className={activeParameter === 'totalNitrogen' ? `${item} ${active}` : `${item}`}>
                        Total Nitrogen
                    </li></Link>
                    {/* Total Phosphorus */}
                    <Link to='/learn/indicators/total_phosphorus'><li className={activeParameter === 'totalPhosphorus' ? `${item} ${active}` : `${item}`}>
                        Total Phosphorus
                    </li></Link>
                    {/* Turbidity */}
                    <Link to='/learn/indicators/turbidity'><li className={activeParameter === 'turbidity' ? `${item} ${active}` : `${item}`}>
                        Turbidity
                    </li></Link>
                </ul>
            </nav>
        </div>
    )

}

export default ParameterMenu;