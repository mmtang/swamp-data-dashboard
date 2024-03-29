import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Button, Icon, Popup, Segment } from 'semantic-ui-react';
import { colorPaletteViz, popupStyle } from '../../constants/constants-app';
// Import styles
import { 
    compareContainer, 
    compareRow, 
    leftContainer,
    popupContainer, 
    popupTitle, 
    stationCode,
    stationName,
    stationWrapper
} from './compare-sites.module.css';

export default function CompareSites({ 
    analyte,
    comparisonSites, 
    selecting, 
    setComparisonSites,
    setSelecting, 
    setVizColors,
    siteShapeDict,
    station,
    vizColors
}) {  
    const [allSites, setAllSites] = useState([]);
    const selectLimit = 5;
    
    const handleChange = (evt) => {
        if (!selecting) {
            // Check that the number of sites has not exceeded the limit
            if (allSites.length < selectLimit) {
                setSelecting(true);
            }
        } else if (selecting) {
            setSelecting(false);
        }
    }

    const handleRemove = (code) => {
        const siteIndex = findSiteInArray(comparisonSites, code);
        // Remove site
        const newSiteArr = removeObjByIndex(comparisonSites, siteIndex);
        setComparisonSites(newSiteArr);
        // Re-order colors
        const newColorArr = removeColorByIndex(vizColors, siteIndex);
        setVizColors(newColorArr);
    }

    const findSiteInArray = (arr, value) => {
        const matchedSiteIndex = arr.findIndex((obj) => obj['StationCode'] === value);
        return matchedSiteIndex;
    }

    const removeObjByIndex = (arr, index) => {
        // When copying the state array, use the spread operator or slice the array to create a copy; or else, React will copy the same reference to the state array and any changes made using the set function won't trigger a rerender (https://stackoverflow.com/a/67354136)
        let newArr = [...arr];
        // Only splice if the item is found
        if (index > -1) {
            newArr.splice(index, 1);
        }
        return newArr;
    }

    const removeColorByIndex = (arr, index) => {
        const allSiteIndex = index + 1;  // Need to add 1 to the index because this passed index is for the comparisonSites array (does not include original selected site)
        let newArr = [...arr];
        if (allSiteIndex > 0) {
            // Get value at index
            const removeValue = newArr[allSiteIndex];
            // Remove value at index
            newArr.splice(allSiteIndex, 1);
            // Add value to end of array so that it can be reused again if enough sites are added again
            newArr.push(removeValue);
        }
        return newArr;
    }

    useEffect(() => {
        if (station) {
            const newArr = [station, ...comparisonSites];
            setAllSites(newArr);
        }
    }, [comparisonSites]);

    useEffect(() => {
        setAllSites([]);
        setVizColors(colorPaletteViz);
    }, [station]);

    const colorRow = (d, i) => {
        return (
            <div className={leftContainer}>
                <div>
                    <Icon name='map marker' />&nbsp;
                </div>
                <div className={stationWrapper}>
                    <div className={stationCode} style={{ color: `${vizColors[i]}` }}>
                        {d.StationCode}
                    </div>
                    <div className={stationName}>{d.StationName}</div>
                </div>
            </div>
        )
    }

    const shapeRow = (d, i) => {
        let siteSymbol = null;
        if (siteShapeDict[d.StationCode]) {
            siteSymbol = d3.symbol().type(siteShapeDict[d.StationCode]).size(78);
        }
        return (
            <div className={leftContainer}>
                <div style={{ width: '24px !important' }}>
                    <svg style={{ height: '20px', width: '20px' }}>
                        { siteSymbol ? 
                            <path d={siteSymbol()} fill="#818182" transform="translate(10, 11)" />
                        : null }
                    </svg>
                </div>&nbsp;&nbsp;
                <div className={stationWrapper}>
                    <div className={stationCode} style={{ color: '#103c68' }}>
                        {d.StationName}
                    </div>
                    <div className={stationName}>{d.StationCode}</div>
                </div>
            </div>
        )
    }
    
    return (
        <Segment textAlign='center'>
             <div className={popupContainer}>
                <span className={popupTitle}>Compare stations</span>
                <Popup
                    inverted
                    style={popupStyle}
                    trigger={
                        <Button 
                            color={!selecting ? 'blue' : 'black'}
                            compact
                            onClick={handleChange}
                            onKeyPress={handleChange}
                            size='mini' 
                        >
                            { !selecting ? <div><Icon name='add' />Add station</div> : <div><Icon name='mouse pointer' />Selecting</div> }
                        </Button>
                    }
                    content={allSites.length < selectLimit ? `Toggle this button and then select a station from the map or table. A maximum of ${selectLimit} stations can be graphed at one time.` : <div><Icon bordered inverted color='red' name='exclamation' size='small' />&nbsp;{`A maximum of ${selectLimit} stations can be graphed at one time. Remove a station before adding another.`}</div>}
                    size='tiny'
                />
            </div>
            { allSites.length > 1 ? 
                <div className={compareContainer}>
                    { allSites.map((d, i) => {
                        return (
                            <div className={compareRow} key={d.StationCode}>
                                {shapeRow(d, i)}                        
                                <div>
                                    { i > 0 ? 
                                        <Icon 
                                            color='grey'
                                            link
                                            name='x' 
                                            onClick={() => handleRemove(d.StationCode)}
                                            onKeyPress={() => handleRemove(d.StationCode)}
                                            tabIndex={0}
                                        />
                                    : null }
                                </div>
                            </div>
                        )
                    }) }
                </div>
                : null
            }
        </Segment>
    )
}