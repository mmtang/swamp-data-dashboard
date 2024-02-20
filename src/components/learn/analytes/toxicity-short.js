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
import { toxColors } from '../../../constants/constants-app';
import { linkStyle, listContainer, textStyle } from './analytes.module.css';

const ToxicityShort = () => {
    return (
        <div>
            <p>Toxicity tests are used to determine the effects of pollutants upon aquatic organisms. These tests are typically conducted by exposing laboratory-grown organisms, such as water fleas, to a water or sediment sample for a set amount of time and comparing the resulting effects to a control consisting of uncontaminated water or sediment.</p>
            <p>Each sample response is compared to the control response within a test batch. The relative difference in the responses determines the magnitude of toxicity. The threshold value used to determine if a sample result is toxic or non-toxic can be different for each test batch depending on the control response.</p>
            <p>Sample results assessed as "likely toxic" are displayed in red, as follows:</p>
            <Divider hidden />
            <List>
                <ListItem className={listContainer}>
                    <ListIcon name='circle' style={{ color: `${toxColors.darkRed}` }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Likely toxic</ListHeader>
                        <ListDescription className={textStyle}>
                            The result is significantly different from the control, and the percent effect is greater than the evaluation threshold. Includes data points with the "SL" qualifier.
                        </ListDescription>
                    </ListContent>
                </ListItem>
            </List>
            <Divider hidden />
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

export default ToxicityShort;