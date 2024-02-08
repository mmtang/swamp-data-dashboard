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
            <p>The data points graphed above are outlined based on the following:</p>
            <Divider hidden />
            <List>
                <ListItem className={listContainer}>
                    <ListIcon name='circle outline' size='big' style={{ color: `${toxColors.lightBlue}` }} />
                    {/*
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <circle cx="100" cy="50" r="15" stroke="#8ec4de" stroke-width="5" fill="none" />
                    </svg> 
                    */}
                    <ListContent>
                        <ListHeader className={textStyle}>Likely non-toxic</ListHeader>
                        <ListDescription className={textStyle}>
                            The result is not significantly different from the control, and/or the percent effect is not greater than the evaluation threshold.
                        </ListDescription>
                    </ListContent>
                </ListItem>
                <ListItem className={listContainer}>
                    <ListIcon name='circle outline' size='big' style={{ color: `${toxColors.lightRed}` }} />
                    <ListContent>
                        <ListHeader className={textStyle}>Likely toxic</ListHeader>
                        <ListDescription className={textStyle}>
                            The result is significantly different from the control, and the percent effect is greater than the evaluation threshold.
                            <HelpIcon position='right center'>This includes data points with the "SL" qualifier.</HelpIcon>
                        </ListDescription>
                    </ListContent>
                </ListItem>
            </List>
            <Divider hidden />
            <p>Toxicity tests are used to determine the effects of pollutants upon aquatic organisms. These tests are typically conducted by exposing laboratory-grown organisms, such as water fleas, to a water or sediment sample for a set amount of time and comparing the resulting effects to a control consisting of uncontaminated water or sediment.</p>
            <p>Each sample response is compared to the control response within a test batch. The relative difference in the responses determines the magnitude of toxicity. The threshold value used to determine if a sample result is toxic or non-toxic can be different for each test batch depending on the control response.</p>
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
            <Divider hidden />
        </div>
    )
}

export default Toxicity;