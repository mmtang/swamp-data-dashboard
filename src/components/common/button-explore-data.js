import React from 'react';
import { withPrefix } from 'gatsby';
import { Button } from 'semantic-ui-react';

export default function ButtonExploreData({ stationCode }) {   
    return (
        <a href={withPrefix('/stations/?id=' + encodeURIComponent(stationCode))} target="_blank" rel="noopener noreferrer">
            <Button 
                basic 
                color='grey' 
                icon='external alternate' 
                size='mini'
            />
        </a>
    )
}