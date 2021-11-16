import React, { useState } from 'react';
import { Accordion, Icon, Label } from 'semantic-ui-react';
import HelpIcon from '../icons/help-icon';
import RegionMenu from '../map-controls/region-menu';
import AnalyteMenu from '../map-controls/analyte-menu';
import ProgramMenu from '../map-controls/program-menu';
import { customAccordion, customTitle, titleWrapper, leadingIcon, panelContent, pLabel, customLabel, analyteWrapper } from './accordion-menu.module.css';


// This component generates the structure for the accordion menu on the explore_data index page
// It calls upon other componenets to fill the content for each panel

export default function AccordionMenu({ region, setRegion, analyte, setAnalyte, program, setProgram }) {  
    // Open all three panels upon initial load; keep track of selection and save to state
    const [activeIndex, setActiveIndex] = useState([0, 1, 2]);

    // Function for opening and closing the accordion panels
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
                className={customTitle}
                active={activeIndex.includes(0)}
                index={0}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        <Icon className={leadingIcon} name='search' />
                        Search
                    </div>
                    { activeIndex.includes(0) ? <Icon name='angle up' /> : <Icon name='angle down' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(0)} className={panelContent}>
                <p className={pLabel}>
                    Location, waterbody, monitoring site 
                    <HelpIcon wide={true}>
                        <p>Search for a specific location (city, region), landmark, waterbody (river, lake, reservoir), or SWAMP monitoring site (station name or code).</p>
                        <p>This search uses the ArcGIS World Geocoding Service and also searches through the features in the loaded map layers. The results are categorized by source/layer.</p>
                        <p>By default, this search uses a library of Integrated Report waterbodies. For Basin Plan waterbodies, turn on the Basin Plan layer in the <strong>Layers</strong> section and try searching again once the layer has completely loaded.</p>
                    </HelpIcon>
                </p>
                {/* Container for the ArcGIS JavaScript search widget */}
                <div id="searchContainer" style={{ border: '1px solid #6e6e6e', marginBottom: '0.4em' }} />
                <p className={pLabel}>
                    <span>Example: Lagunitas Creek, 201LAG195, or Nicasio, CA</span>
                </p>
            </Accordion.Content>

            {/* Filter */}
            <Accordion.Title
                className={customTitle}
                active={activeIndex.includes(1)}
                index={1}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        <Icon className={leadingIcon} name='filter' />
                        Filters
                    </div>
                    { activeIndex.includes(1) ? <Icon name='angle up' /> : <Icon name='angle down' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(1)}>
                <p className={pLabel}>
                    Statewide monitoring program
                    <HelpIcon wide='very'>
                        <p>In addition to its regional monitoring efforts, SWAMP oversees and funds four statewide monitoring programs. These statewide programs provide a "big picture" assessment of the overall status and trends of water quality throughout California.</p>
                        <p><strong>Bioaccumulation Monitoring Program</strong> - Assesses whether fish found in California's streams, lakes, and coastal areas are safe to eat by measuring contaminant concentrations in fish tissue.</p>
                        <p><strong>Bioassessment Monitoring Program</strong> - Assesses the health of streams and rivers by surveying the aquatic life (insects and algae) living in a waterbody and compares the results to expected reference conditions.</p>
                        <p><strong>Freshwater and Estuarine Harmful Algal Blooms Program</strong> - Addresses harmful algal blooms, particularly orgiinating from cyanobacteria (blue green algae), in freshwater and estuarine systems throughout California.</p>
                        <p><strong>Stream Pollution Trends Monitoring Program</strong> - Monitors trends in sediment toxicity and sediment contaminent concentrations, and relates contaminent concentrations to watershed land uses.</p>
                    </HelpIcon>
                </p>
                <ProgramMenu program={program} setProgram={setProgram} />
                <p className={pLabel}>
                    Regional water quality control board
                    <HelpIcon wide='very'>
                        <p>In addition to the State Water Resources Control Board, which sets statewide policy, there are nine semi-autonomous <strong>regional water quality control boards</strong> statewide. Each Regional Board makes critical water quality decisions for its region, including setting standards, issuing waste discharge requirements, determining compliance with those requirements, and taking appropriate enforcement actions.</p>
                        <img src="\rb_map.jpg" alt='Statewide map of regional water board boundaries' style={{ display: 'block', margin: 'auto', maxWidth: '360px' }} />
                        <p><a href="https://www.waterboards.ca.gov/publications_forms/publications/factsheets/docs/boardoverview.pdf" target="_blank" rel="noreferrer noopener">Source</a></p>
                    </HelpIcon>
                </p>
                <RegionMenu region={region} setRegion={setRegion} />
                <p className={pLabel}>
                    Water quality indicators
                    <HelpIcon wide={true}>
                        <p>SWAMP measures a variety of <strong>chemical, physical, and biological indicators</strong> that help us determine the quality of water in rivers, lakes, and other waterbodies. Each indicator tells us something different about the condition of the waterbody. Evaluating them together provides a more complete picture of the waterbody's overall ecology and health.</p>
                        <p>Selecting an indicator will display the trend data for that indicator on the map and the table.</p>
                        <p>Learn more about each <a href="/learn/indicators" target="_blank" rel="noreferrer noopener">water quality indicator</a>.</p>
                    </HelpIcon>
                </p>
                <div className={analyteWrapper}>
                    {/* A high value is needed for flex-basis so that the select box doesn't collapse under flexbox. The actual value is seemingly not that important, only that it's a high value. It might be better to set the width of the select. */}
                    <div style={{ flexBasis: '100%'}}>
                        <AnalyteMenu analyte={analyte} setAnalyte={setAnalyte} />
                    </div>
                    {/*
                    <div>
                        <Label pointing="left" className={customLabel}>
                            Select to view trend data
                        </Label>
                    </div>
                    */}
                </div>
            </Accordion.Content>

            {/* Layers */}
            <Accordion.Title
                className={customTitle}
                active={activeIndex.includes(2)}
                index={2}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        <Icon className={leadingIcon} name='map' />
                        Map Layers
                    </div>
                    { activeIndex.includes(2) ? <Icon name='angle up' /> : <Icon name='angle down' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(2)}>
                <div id="layerListContainer" />
            </Accordion.Content>
        </Accordion> 
    )
}