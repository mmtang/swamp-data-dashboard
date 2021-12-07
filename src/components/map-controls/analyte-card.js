import React from 'react';
import ParameterIcon from '../icons/parameter-icon';
import { Icon } from 'semantic-ui-react';
import { analyteNameDict, analyteBlurb, analytePageDict } from '../../utils/constants';
import { arrowContainer, arrowUp, cardContainer, iconWrapper } from './card.module.css';

export default function AnalyteCard({ analyte }) {
    if (analyte) {
        return (
            <React.Fragment>
                {/*
                <div className={arrowContainer}>
                    <div className={arrowUp}></div>
                </div>
                */}
                <div className={cardContainer}>
                    <div style={{ display: 'flex' }}>
                        <div className={iconWrapper}>
                            <ParameterIcon icon={analyteNameDict[analyte]} size={60} />
                        </div>
                        <p>
                            {analyteBlurb[analyteNameDict[analyte]]}
                            &nbsp;<a href={`/learn/indicators/${analytePageDict[analyte]}`} target='_blank' rel='noreferrer noopener'>Read more&nbsp;&nbsp;<Icon name='external' /></a>
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