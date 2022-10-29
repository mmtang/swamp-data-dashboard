import React, { useEffect, useState } from 'react';
import { Button, Icon, Segment, Table } from 'semantic-ui-react';

import { colorPaletteViz } from '../../constants/constants-app';

export default function CompareSites({ 
    comparisonSites, 
    selecting, 
    setSelecting, 
    setComparisonSites,
    station
}) {  
    const [allSites, setAllSites] = useState([]);
    
    const handleChange = (evt) => {
        setSelecting(!selecting);
    }

    const handleRemove = (code) => {
        const newArr = removeObjByAttribute(comparisonSites, code);
        setComparisonSites(newArr);
    }

    const removeObjByAttribute = (arr, value) => {
        // When copying the state array, use the spread operator or slice the array to create a copy; or else, React will copy the same reference to the state array and any changes made using the set function won't trigger a rerender (https://stackoverflow.com/a/67354136)
        let newArr = [...arr];
        const matchedObjIndex = newArr.findIndex((obj) => obj['StationCode'] === value);
        // Only splice if the item is found
        if (matchedObjIndex > -1) {
            newArr.splice(matchedObjIndex, 1);
        }
        return newArr;
    }

    useEffect(() => {
        if (station && comparisonSites.length > 0) {
            const newArr = [station, ...comparisonSites];
            setAllSites(newArr);
        }
    }, [comparisonSites]);

    useEffect(() => {
        setAllSites([]);
    }, [station]);
    
    return (
        <Segment textAlign='center'>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1em', fontWeight: 600, color: '#103c68' }}>Compare stations</span>
                <Button 
                    color={!selecting ? 'blue' : 'black'}
                    compact
                    onClick={handleChange}
                    onKeyPress={handleChange}
                    size='mini' 
                >
                    { !selecting ? 'Add stations' : 'Stop adding' }
                </Button>
            </div>
            { allSites.length > 0 ? 
                <Table celled striped>
                    <Table.Body>
                        { allSites.map((d, i) => {
                            return (
                                <Table.Row key={d.StationCode} style={{ fontSize: '0.92em' }}>
                                    <Table.Cell style={{ fontWeight: '600', color: `${colorPaletteViz[i]}` }}>{d.StationCode}</Table.Cell>
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