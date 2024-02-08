import React from 'react';
import Csci from './analytes/csci';
import Toxicity from './analytes/toxicity';

const AboutData = ({ analyte }) => {
    const getAnalyteInfo = (analyte) => {
        if (analyte) {
            if (analyte.source === 'toxicity') {
                return <Toxicity />
            } else {
                if (analyte.label) {
                    switch(analyte.label) {
                        case 'California Stream Condition Index (CSCI)':
                            return <Csci />;
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

export default AboutData;