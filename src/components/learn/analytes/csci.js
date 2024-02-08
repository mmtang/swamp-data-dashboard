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

const Csci = () => {
    return (
        <div>
            <h3>About the data</h3>
            <p>The California Stream Condition Index (CSCI) is a statewide index used to translate complex data about benthic macroinvertebrates found living in a stream into an overall measure of stream health. It combines two different types of indices: a multi-metric index that measures ecological structure and function, and an observed-to-expected index that measures taxonomic completeness.</p>
            <Divider hidden />
            <List>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#d6efd0' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Likely intact stream conditions</ListHeader>
                        <ListDescription className={textStyle}>
                            ≥ 0.92
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#ffffd6' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Possibly altered stream conditions</ListHeader>
                        <ListDescription className={textStyle}>
                            0.80 - 0.91
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#fee0b7' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Likely altered stream conditions</ListHeader>
                        <ListDescription className={textStyle}>
                            0.63 - 0.79
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='full square' size='big' style={{ color: '#fbc3be' }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Very likely altered stream conditions</ListHeader>
                        <ListDescription className={textStyle}>
                            ≤ 0.62
                        </ListDescription>
                    </ListContent>
                </ListItem>
            </List>
            <Divider hidden />
            <p>CSCI scores approaching 0 indicate a greater departure from reference condition and degradation of biological condition. Scores greater than 1 indicate greater taxonomic richness and more complex ecological function than predicted for a site given its natural environment setting.</p>
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
            <Divider hidden />
        </div>
    )
}

export default Csci;