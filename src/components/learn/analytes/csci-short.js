import React from 'react';
import {
    Divider,
    ListItem,
    ListIcon,
    ListHeader,
    ListDescription,
    ListContent,
    List
} from 'semantic-ui-react';
import { linkStyle, listContainer, textStyle } from './analytes.module.css';

const CsciShort = () => {
    return (
        <div>
            <p>The California Stream Condition Index (CSCI) is a statewide index used to translate complex data about benthic macroinvertebrates found living in a stream into an overall measure of stream health. CSCI scores closer to 0 indicate a greater departure from reference condition and degradation of biological condition. Scores close to or greater than 1 indicate taxonomic richness and ecological function similar to levels predicted for a site given its natural environmental setting.</p>
            <Divider hidden />
            <List>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#d6efd0' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Likely intact stream condition</ListHeader>
                        <ListDescription className={textStyle}>
                            ≥ 0.92
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#ffffd6' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Possibly altered stream condition</ListHeader>
                        <ListDescription className={textStyle}>
                            0.80 - 0.91
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#fee0b7' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Likely altered stream condition</ListHeader>
                        <ListDescription className={textStyle}>
                            0.63 - 0.79
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#fbc3be' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Very likely altered stream condition</ListHeader>
                        <ListDescription className={textStyle}>
                            ≤ 0.62
                        </ListDescription>
                    </ListContent>
                </ListItem>
            </List>
            <Divider hidden />
            <p>More information:</p>
            <List bulleted className={linkStyle}>
                <ListItem>
                    <ListDescription>
                        <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/docs/csci_tech_memo.pdf" target="_blank" rel="noopener noreferrer">The California Stream Condition Index (CSCI): A New Statewide Biological Scoring Tool for Assessing the Health of Freshwater Streams</a>
                    </ListDescription>
                </ListItem>
                <ListItem>
                    <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/" target="_blank" rel="noopener noreferrer">SWAMP Bioassessment Program</a>
                </ListItem>
            </List>
        </div>
    )
}

export default CsciShort;