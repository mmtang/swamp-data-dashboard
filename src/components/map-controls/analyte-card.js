import React from 'react';
import ParameterIcon from '../icons/parameter-icon';
import { Icon } from 'semantic-ui-react';
import { analytes } from '../../utils/constants';
import { arrowContainer, arrowUp, cardContainer, iconWrapper } from './card.module.css';

export default function AnalyteCard({ analyte }) {
    if (analytes[analyte]) {
        return (
            <React.Fragment>
                {/*
                <div className={arrowContainer}>
                    <div className={arrowUp}></div>
                </div>
                */}
                <div className={cardContainer}>
                    <div style={{ display: 'flex' }}>
                        {/* Do not display the indicator icon if it does not exist yet */}
                        { analytes[analyte]['code'] ?
                            <div className={iconWrapper}>
                                <ParameterIcon icon={analytes[analyte]['code']} size={60} />
                            </div>
                          : null 
                        } 
                        <p>
                            { analytes[analyte]['blurb'] }
                            &nbsp;
                            {/* Display the 'Read more' link for those indicators that have an indicator page. Do not display the link if the page does not exist yet */}
                            { analytes[analyte]['page'] ? <a href={`/learn/indicators/${analytes[analyte]['page']}`} target='_blank' rel='noreferrer noopener'>Read more&nbsp;&nbsp;<Icon name='external' /></a> : '' }
                        </p>
                    </div>
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <div></div>
        )
    }
}