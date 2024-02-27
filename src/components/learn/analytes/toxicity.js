import React from 'react';
import HelpIcon from '../../icons/help-icon';
import {
    Divider,
    ListItem,
    ListIcon,
    ListHeader,
    ListDescription,
    ListContent,
    List
} from 'semantic-ui-react';
import { toxColors } from '../../../constants/constants-app';
import { linkStyle, listContainer, textStyle } from './analytes.module.css';

const Toxicity = () => {
    return (
        <div>
            <h3>About the data</h3>
            <p>Sample results classified as "toxic" are displayed on the graph with a <b>red outline</b>, as follows:</p>
            <Divider hidden />
            <List>
                <ListItem className={listContainer}>
                    <ListIcon name='circle outline' size='large' style={{ color: `${toxColors.lightRed}` }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Toxic</ListHeader>
                        <ListDescription className={textStyle}>
                            The result is significantly different from the control, and the percent effect is greater than the evaluation threshold. Includes data points with the "SL" qualifier.
                        </ListDescription>
                    </ListContent>
                </ListItem>
            </List>
            <Divider hidden />
            <p>Toxicity tests are used to determine the effects of pollutants on aquatic organisms. These tests are typically conducted by exposing laboratory-grown organisms, such as water fleas, to water or sediment samples for a specific test duration. At the end of the test, each sample response is compared to the response of a control sample consisting of uncontaminated water or sediment. Within every test batch, the relative difference between the control and sample responses is calculated to determine the magnitude of toxicity. The control response must meet test acceptability criteria to be used for toxicity calculations. If the percent relative difference from the control is greater than the evaluation threshold, the sample is considered toxic.</p>
            <p>More information:</p>
            <List bulleted className={linkStyle}>
                <ListItem>
                    <ListDescription>
                        <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/docs/workplans/intro_toxicity_tech_memo_feb.pdf" target="_blank" rel="noopener noreferrer">Introduction to Toxicity Test Methodology and Applications</a>
                    </ListDescription>
                </ListItem>
                <ListItem>
                    <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/spot/" target="_blank" rel="noopener noreferrer">SWAMP Stream Pollution Trends Monitoring Porgram</a>
                </ListItem>
            </List>
        </div>
    )
}

export default Toxicity;