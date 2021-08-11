import React from 'react';
import { Button } from 'semantic-ui-react';

export default function FilterByExtent({ setFilterExtentToggle }) {   
    const handleClick = () => {
        setFilterExtentToggle(true);
    }

    return (
        <Button compact 
            size='tiny'
            //disabled={selectedSites.length < 1 || !(analyte)}
            onClick={handleClick} 
            onKeyPress={handleClick}
        >
            Filter by map extent
        </Button>
    )
}