import React from 'react';
import HelpIcon from '../icons/help-icon';
import { List, ListItem } from 'semantic-ui-react';
import { symbol, symbolCircle } from 'd3';
import { iconWrapper, messageContainer } from './nd-message.module.css';

export default function NdMessage() {
    const ndCircle = symbol().type(symbolCircle).size(80);

    return (
            <div className={messageContainer}> 
                <div>
                    <svg className={iconWrapper}>
                        <path d={ndCircle()} fill="#e3e4e6" stroke="#767676" strokeDasharray={('2,1')}strokeWidth={2} transform="translate(10, 11)" />
                    </svg>
                    &nbsp;&nbsp;&nbsp;&nbsp;Not detected (ND) or detected not quantifiable (DNQ)&nbsp;
                    <HelpIcon position='top center' wide={true}>
                        <p>
                            <svg className={iconWrapper}>
                                <path d={ndCircle()} fill="#e3e4e6" stroke="#767676" strokeDasharray={('2,1')}strokeWidth={2} transform="translate(10, 11)" />
                            </svg>
                            &nbsp;&nbsp;&nbsp;&nbsp;Any shape data point on the graph with a dashed or dotted outline represents a not detected (ND) result, meaning that the concentration was below detection limits and could not be reliably detected; or a detected not quantifiable (DNQ) result, meaning that the concentration was above detection limits but could not be reliably quantified. The SWAMP Data Dashboard handles such data as follows:
                        </p>
                        <List bulleted style={{ fontSize: '0.94em' }}>
                            <ListItem>ND results are displayed as the reported value, if available, or displayed using a substituted value of 1/2 the method detection limit (MDL).</ListItem>
                            <ListItem>DNQ results are displayed as the reported value, if available, or displayed using a substituted value of the MDL value.</ListItem>
                        </List>
                        <p>The substitute values are conservative estimates that can underestimate the actual concentration present in a sample. The above also applies to tissue data and the calculation of annual averages.</p>
                    </HelpIcon></div>
            </div>
    )
}