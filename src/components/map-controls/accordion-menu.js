import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import HelpIcon from '../icons/help-icon';
import { customAccordion, titleWrapper, leadingIcon, panelContent, pLabel } from './accordion-menu.module.css';

// This component generates the structure for the accordion menu on the explore_data index page
// It calls upon other componenets to fill the content for each panel
export default function AccordionMenu() {  
    // Open all three panels upon initial load; keep track of selection and save to state
    const [activeIndex, setActiveIndex] = useState([0, 1, 2]);
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex;
        
        const currentIndexPosition = activeIndex.indexOf(index);
        if (currentIndexPosition > -1) {
            // If the clicked index number is already in the array, remove it
            newIndex.splice(currentIndexPosition, 1);
        } else {
            // Otherwise, add it
            newIndex.push(index);
        }
        // Use the spread operator to ensure the state reference is updated and the componenet re-renders
        setActiveIndex([...newIndex]);
    }

    return (
        <Accordion 
            className={customAccordion}
            exclusive={false}
            fluid
            styled
        >
            {/* Search */}
            <Accordion.Title
                active={activeIndex.includes(0)}
                index={0}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        <Icon className={leadingIcon} name='search' />
                        Search
                    </div>
                    { activeIndex.includes(0) ? <Icon name='angle down' /> : <Icon name='angle right' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(0)} className={panelContent}>
                <p className={pLabel}>
                    <span>
                        Location, waterbody, monitoring site 
                        <HelpIcon>
                            <div>
                                <p>Search for a specific location (city, region), landmark, waterbody (river, lake, reservoir), or SWAMP monitoring site (station name or code).</p>
                                <p>This search uses the ArcGIS World Geocoding Service and also searches through the features in the loaded map layers. The results are categorized by source/layer.</p>
                                <p>By default, this search uses a library of Integrated Report waterbodies. For Basin Plan waterbodies, turn on the Basin Plan layer in the <strong>Layers</strong> section below and try searching again once the layer has completely loaded.</p>
                            </div>
                        </HelpIcon>
                    </span>
                </p>
                {/* Container for the ArcGIS JavaScript search widget */}
                <div id="searchContainer" style={{ border: '1px solid #6e6e6e', marginBottom: '0.4em' }} />
                <p className={pLabel}>
                    <span>Example: Lagunitas Creek, 201LAG195</span>
                </p>
            </Accordion.Content>

            {/* Filter */}
            <Accordion.Title
                active={activeIndex.includes(1)}
                index={1}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        <Icon className={leadingIcon} name='filter' />
                        Filters
                    </div>
                    { activeIndex.includes(1) ? <Icon name='angle down' /> : <Icon name='angle right' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(1)}>
                <p>A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
            </Accordion.Content>

            {/* Layers */}
            <Accordion.Title
                active={activeIndex.includes(2)}
                index={2}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        <Icon className={leadingIcon} name='map' />
                        Layers
                    </div>
                    { activeIndex.includes(2) ? <Icon name='angle down' /> : <Icon name='angle right' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(2)}>
                <p>A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
            </Accordion.Content>
        </Accordion> 
    )
}