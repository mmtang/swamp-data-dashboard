import React from 'react';
import { Link } from 'gatsby';
import { analytes } from '../../utils/constants';
import { container, menu, title, item, active } from './parameter-menu.module.css';


const ParameterMenu = ({ activeParameter }) => {
    // Sort ascending by the label property of the analyte dictionary items
    const analyteItems = Object.values(analytes).sort((a, b) => a['label'].toLowerCase().localeCompare(b['label'].toLowerCase()));
    // Build the list/menu items for only those indicators that have pages
    const menuItems = analyteItems.map(d => {
        if (d.page) {
            return (
                <Link to={`/learn/indicators/${d.page}`}><li className={activeParameter === d.code ? `${item} ${active}` : `${item}`}>{d.label}</li></Link>
            );
        }
    });

    return (
        <div className={container}>
            <nav aria-label='Indicator pages navigation'>
                <ul className={menu}>
                    <div className={title}><Link to='/learn/indicators'>Water quality indicators</Link></div>
                    { menuItems }
                </ul>
            </nav>
        </div>
    )

}

export default ParameterMenu;