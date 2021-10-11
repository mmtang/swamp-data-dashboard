import { namespace } from 'd3-selection';
import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';


const MainMenu = ({ title }) => {
    const [activeItem, setActiveItem] = useState('Measuring water quality');

    const handleItemClick = (event, { name }) => {
        console.log(name);
        setActiveItem(name);
    }

    return (
        <Menu fluid widths={3}>
            <Menu.Item
                name='Measuring water quality'
                active={activeItem === 'Measuring water quality'}
                onClick={handleItemClick}
            />
            <Menu.Item
                name='Calculating trends'
                active={activeItem === 'Calculating trends'}
                onClick={handleItemClick}
            />
            <Menu.Item
                name='Assessing'
                active={activeItem === 'Assessing'}
                onClick={handleItemClick}
            />
        </Menu>
    )

}

export default MainMenu;