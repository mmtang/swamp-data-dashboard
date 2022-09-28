import React, { useState } from 'react';
import { withPrefix } from 'gatsby';
import AnalyteMenu from '../map-controls/analyte-menu';
import HelpIcon from '../icons/help-icon';
import ProgramMenu from '../map-controls/program-menu';
import RegionMenu from '../map-controls/region-menu';
import { Accordion, Icon } from 'semantic-ui-react';
import { analyteWrapper, customAccordion, customTitle, pLabel, titleWrapper} from './accordion-menu.module.css';


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
            {/*
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
            <Accordion.Content active={activeIndex.includes(0)}>
                <p className={pLabel}>
                    Location, waterbody, monitoring site 
                    <HelpIcon wide={true}>
                        <p>Search for a specific location (city, region), landmark, waterbody (river, lake, reservoir), or SWAMP monitoring site (station name or code). The results are categorized by source/layer. By default, this search uses a library of Integrated Report 2018 waterbodies.</p>
                    </HelpIcon>
                </p>
                <div id="searchContainer" style={{ border: '1px solid #6e6e6e', marginBottom: '0.4em' }} />
                <p className={pLabel}>
                    <span>Example: Lagunitas Creek, 201LAG195, or Nicasio, CA</span>
                </p>
            </Accordion.Content>
            */}

            {/* Filter */}
            <Accordion.Title
                className={customTitle}
                active={activeIndex.includes(1)}
                index={1}
                onClick={handleClick}
            >
                <div className={titleWrapper}>
                    <div>
                        {/*<Icon className={leadingIcon} name='filter' />*/}
                        Statewide monitoring program
                    </div>
                    { activeIndex.includes(1) ? <Icon name='angle up' /> : <Icon name='angle down' /> }
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(1)}>
                <p className={pLabel}>
                    Statewide monitoring program
                    <HelpIcon wide={true}>
                        <p>In addition to its regional monitoring efforts, SWAMP oversees and funds four statewide monitoring programs: the <strong><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioaccumulation_monitoring.html" target="_blank" rel="noopener noreferrer">Bioaccumulation Monitoring Program</a></strong>, <strong><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/" target="_blank" rel="noopener noreferrer">Bioassessment Program</a></strong>, <strong><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/freshwater_cyanobacteria.html" target="_blank" rel="noopener noreferrer">Freshwater and Estuarine Harmful Algal Blooms Program</a></strong>, and <strong><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/spot/" target="_blank" rel="noopener noreferrer">Stream Pollution Trends Monitoring Program</a></strong>. These statewide programs provide a "big picture" assessment of the overall status and trends of water quality throughout California.</p>
                        <p>Programs that are not yet selectable will be added at a future date.</p>
                    </HelpIcon>
                </p>
                <ProgramMenu program={program} setProgram={setProgram} />
                <p className={pLabel}>
                    Regional water quality control board
                    <HelpIcon wide='very'>
                        <p>SWAMP’s regional assessments are planned and executed by each of the nine Regional Water Quality Control Boards. Each region identifies its own monitoring priorities and designs assessments to answer specific monitoring questions. SWAMP’s regional assessments complement the statewide assessments by allowing the flexibility needed to address the highest priority monitoring needs at each region.</p>
                        <img src=".\rb-map.jpg" alt='Statewide map of regional water board boundaries' style={{ display: 'block', margin: 'auto', maxWidth: '300px' }} />
                        <p><a href="https://www.waterboards.ca.gov/publications_forms/publications/factsheets/docs/boardoverview.pdf" target="_blank" rel="noreferrer noopener">Source</a></p>
                    </HelpIcon>
                </p>
                <RegionMenu region={region} setRegion={setRegion} />
                <p className={pLabel}>
                    Water quality indicators
                    <HelpIcon wide={true}>
                        <p>SWAMP measures a variety of <a href={withPrefix("/learn/indicators")} target="_blank" rel="noreferrer noopener">chemical, physical, and biological parameters</a> to assess the quality of water in rivers, lakes, and other waterbodies. Each parameter or indicator tells us something different about the condition of the waterbody. Evaluating them together provides a more complete picture of the waterbody's overall health.</p>
                        <p>Selecting an indicator will display the trend data for that indicator on the map and table.</p>
                    </HelpIcon>
                </p>
                <div className={analyteWrapper}>
                    {/* A high value is needed for flex-basis so that the select box doesn't collapse under flexbox. The actual value is seemingly not that important, only that it's a high value. It might be better to set the width of the select. */}
                    <div style={{ flexBasis: '100%'}}>
                        <AnalyteMenu 
                            analyte={analyte} 
                            setAnalyte={setAnalyte} 
                            region={region}
                            program={program}
                        />
                    </div>
                </div>
            </Accordion.Content>

            {/* Layers */}
            {/*
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
            */}
        </Accordion> 
    )
}