import React from 'react';
import CsciShort from './analytes/csci-short';
import HelpIcon from '../icons/help-icon';
import ToxicityShort from './analytes/toxicity-short';

const AboutDataShort = ({ analyte }) => {
    const getAnalyteInfo = (analyte) => {
        if (analyte) {
            console.log(analyte);
            if (analyte.Source === 'toxicity') {
                return <HelpIcon position='bottom center' wide='very'><ToxicityShort /></HelpIcon>
            } else {
                if (analyte.Analyte) {
                    switch(analyte.Analyte) {
                        case 'California Stream Condition Index (CSCI)':
                            return <HelpIcon position='bottom center' wide='very'><CsciShort /></HelpIcon>;
                        default:
                            return <div></div>;
                    }
                } else {
                    return <div></div>;
                }
            }
        } else {
            return <div></div>;
        }
    }

    return (
        getAnalyteInfo(analyte)
    )
}

export default AboutDataShort;