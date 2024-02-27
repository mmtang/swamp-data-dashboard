import React from 'react';
import HelpIcon from '../../icons/help-icon';

import {
    ListItem,
    ListIcon,
    ListHeader,
    ListDescription,
    ListContent,
    List
} from 'semantic-ui-react';
import { toxColors } from '../../../constants/constants-app';
import { legendContainer, textStyle } from './analytes.module.css';

export default function ToxicityLegend() {
    return (
        <div>
            <List>
                <ListItem className={legendContainer}>
                    <ListIcon name='circle' style={{ color: `${toxColors.darkRed}` }} />
                    <ListContent>
                        <ListHeader className={textStyle}>
                            Toxic
                        </ListHeader>
                        <ListDescription className={textStyle}>
                           The result is significantly different from the control, and the percent effect is greater than the evaluation threshold. Includes data points with the "SL" qualifier.
                        </ListDescription>
                    </ListContent>
                </ListItem>
            </List>
        </div>
    )
}