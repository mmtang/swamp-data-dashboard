import React, { useEffect, useState } from 'react';

import { Button, Icon, Popup, Segment, Table } from 'semantic-ui-react';

import { colorPaletteViz } from '../../constants/constants-app';

export default function CompareSites({ 
    comparisonSites, 
    selecting, 
    setSelecting, 
    setComparisonSites,
    setVizColors,
    station,
    vizColors
}) {  
    const [allSites, setAllSites] = useState([]);
    const selectLimit = 5;

    const popupStyle = {
        backgroundColor: '#1a252f',
        borderRadius: 0,
        color: '#ffffff',
        fontSize: '0.8em'
    };
    
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
            // Add value to end of array
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
    
    return (
        <Segment textAlign='center'>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1em', fontWeight: 600, color: '#103c68' }}>Compare stations</span>
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
                <Table celled striped>
                    <Table.Body>
                        { allSites.map((d, i) => {
                            return (
                                <Table.Row key={d.StationCode} style={{ fontSize: '0.92em' }}>
                                    <Table.Cell style={{ fontWeight: '600', color: `${vizColors[i]}` }}>{d.StationCode}</Table.Cell>
                                    <Table.Cell>{d.StationName}</Table.Cell>
                                    <Table.Cell textAlign='right'>
                                        { i > 0 ? 
                                            <Button 
                                                compact
                                                icon
                                                onClick={() => handleRemove(d.StationCode)}
                                                onKeyPress={() => handleRemove(d.StationCode)}
                                                size='mini'
                                            >
                                                <Icon name='x' />
                                            </Button>
                                        : null }
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }) }
                    </Table.Body>
                </Table>
                : null
            }
        </Segment>
    )
}