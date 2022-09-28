import React from 'react';
import { withPrefix } from 'gatsby';
import { Button, Icon } from 'semantic-ui-react';


export default function ButtonExploreData({ stationCode }) {   
    return (
        <a href={withPrefix('/stations/?id=' + encodeURIComponent(stationCode))} target="_blank" rel="noopener noreferrer">
            <Button compact size='tiny'>
                <Icon name='external alternate' />
                Explore all data
            </Button>
        </a>
    )
}