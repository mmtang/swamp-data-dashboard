import React, { useEffect, useState }  from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';

export default function CompareSites({ 
    comparisonSites, 
    selecting, 
    setSelecting, 
    setComparisonSites,
    station 
}) {   
    console.log(comparisonSites);

    const handleChange = (evt) => {
        setSelecting(!selecting);
    }
    
    return (
        <div>
            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell colSpan='3'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1em', fontWeight: 600, color: '#103c68' }}>Compare stations</span>
                                <Button 
                                    color={!selecting ? 'grey' : 'black'}
                                    compact
                                    onClick={handleChange}
                                    onKeyPress={handleChange}
                                    size='mini' 
                                >
                                    { !selecting ? 'Add' : 'Cancel' }
                                </Button>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    { comparisonSites.map(d => {
                        return (
                            <Table.Row key={d.StationCode}>
                                <Table.Cell>{d.code}</Table.Cell>
                                <Table.Cell>{d.name}</Table.Cell>
                                <Table.Cell textAlign='right'>Remove</Table.Cell>
                            </Table.Row>
                        )
                    }) }
                </Table.Body>
            </Table>
        </div>
    )
}